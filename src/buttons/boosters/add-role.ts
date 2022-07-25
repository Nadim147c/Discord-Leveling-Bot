import { MessageActionRow, MessageEmbed, MessageSelectOptionData, Role } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createSelectMenu } from "../../functions/discord/createSelectMenu"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { getSelectOptionsFormRole } from "../../functions/discord/getSelectOptions"
import { Button } from "../../structures/Button"

export default new Button({
    id: "add-boost",
    memberPermissions: ["ADMINISTRATOR"],
    async run(button, command) {
        const filter = (role: Role) => role.name !== "@everyone"
        const roles = button.guild.roles.cache.filter(filter)

        const options: MessageSelectOptionData[] = roles.map(getSelectOptionsFormRole)

        const components = createSelectMenu("Select a role to add as XP booster.", "add-boost", false, ...options)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Add Booster Role")
                .setDescription(`Select the role you want to add.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
