import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { removeRewards } from "../../functions/guildDB/reward"
import { SelectMenu } from "../../structures/SelectMenu"

export default new SelectMenu({
    id: "remove-reward",
    async run(select, command) {
        select.deferUpdate()

        const values = select.values.map((x) => parseInt(x))

        const { removed } = await removeRewards(select.guildId, values)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Removed Reward Role")
                .setDescription(removed.map((x) => `<@&${x.roleId}> ⸺ ${x.level}`).join("\n"))
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(select.user))
                .setTimestamp(),
        ]

        const disableServerSettings = select.member.permissions.has("ADMINISTRATOR") ? false : true
        const components = [
            new MessageActionRow().setComponents(
                createButton("Profile Settings", "profile-settings"),
                createButton("Server Settings", "guild-settings", "SECONDARY", disableServerSettings),
            ),
        ]

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
