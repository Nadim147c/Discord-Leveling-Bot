import { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageSelectOptionData, Role } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createSelectMenu } from "../../functions/discord/createSelectMenu"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { getGuildData } from "../../functions/guildDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: "remove-boost",
    memberPermissions: ["ADMINISTRATOR"],
    async run(button, command) {
        const roles = button.guild.roles.cache

        const guildData = await getGuildData(button.guildId)
        if (!guildData || !guildData.rewards.length)
            return interactionReply(button, `Guild don't have any reward role.`)
        const options: MessageSelectOptionData[] = guildData.rewards.map((reward, i) => ({
            label: `${roles.find((x) => x.id === reward.roleId)?.name ?? "Unknown role"} ⸺ ${reward.level}`,
            value: `${i}`,
        }))

        const components = createSelectMenu("Select role(s) to remove.", "remove-reward", false, ...options)

        components.forEach((x) => x.components.forEach((y: MessageSelectMenu) => y.setMaxValues(y.options.length)))

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Remove Booster Role")
                .setDescription(`Select the roles you want to remove.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
