import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { Button } from "../../structures/Button"

export default new Button({
    id: "guild-settings",
    memberPermissions: ["ADMINISTRATOR"],
    async run(button, command) {
        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Server Settings")
                .setDescription(`Choose what you want change.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        const components = [
            new MessageActionRow().setComponents(
                createButton("Add Reward Role", "add-reward", "SUCCESS"),
                createButton("Remove Reward Role", "remove-reward", "DANGER"),
            ),
            new MessageActionRow().setComponents(
                createButton("Add Booster Role", "add-boost", "SUCCESS"),
                createButton("Remove Booster Role", "remove-boost", "DANGER"),
            ),
            new MessageActionRow().setComponents(createButton("Set Levelup Message", "set-levelup-msg", "SUCCESS")),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
