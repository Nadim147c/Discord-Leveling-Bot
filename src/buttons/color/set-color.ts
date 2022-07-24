import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { Button } from "../../structures/Button"

export default new Button({
    id: "set-color",
    async run(button, command) {
        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Set Accent Color")
                .setDescription(
                    `You can choose a color from our long list of colors or use a custom color with color hex.`,
                )
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        const components = [
            new MessageActionRow().setComponents(
                createButton("Choose a color", "choose-color", "SUCCESS"),
                createButton("Use a custom color", "custom-color", "SUCCESS"),
            ),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
