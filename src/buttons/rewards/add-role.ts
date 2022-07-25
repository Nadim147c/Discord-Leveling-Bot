import { MessageActionRow, MessageEmbed, MessageSelectOptionData, Role } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { createSelectMenu } from "../../functions/discord/createSelectMenu"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { getSelectOptionsFormRole } from "../../functions/discord/getSelectOptions"
import { Button } from "../../structures/Button"

export default new Button({
    id: "add-reward",
    memberPermissions: ["ADMINISTRATOR"],
    async run(button, command) {
        const filter = (role: Role) =>
            !role.managed && role.name !== "@everyone" && !role.permissions.has("ADMINISTRATOR")

        let roles = button.guild.roles.cache.filter(filter)

        if (button.user.id !== button.guild.ownerId)
            roles = roles.filter((role) => role.comparePositionTo(button.member.roles.highest) < 0)

        const options: MessageSelectOptionData[] = roles.map(getSelectOptionsFormRole)

        const components = createSelectMenu("Select role to add as reward.", "add-reward", false, ...options)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Add Reward Role")
                .setDescription(`Choose what you want change.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
