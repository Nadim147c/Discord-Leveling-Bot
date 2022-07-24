import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: "profile-settings",
    async run(button, command) {
        const alerts = (await getOrCreateUserData(button.user.id)).levelup_alert
        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Profile Settings")
                .setDescription(`Choose what you want change.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        const components = [
            new MessageActionRow().setComponents(
                createButton("Set Accent Color", "set-color", "DANGER"),
                createButton("Remove Accent Color", "remove-color", "DANGER"),
            ),
            new MessageActionRow().setComponents(
                createButton("Set Background Color", "set-bg-color", "SUCCESS"),
                createButton("Set Background Image", "set-bg-image", "SUCCESS"),
                createButton("Remove Background", "remove-bg", "DANGER"),
            ),
            new MessageActionRow().setComponents(
                createButton(
                    alerts ? "Disable Levelup Mentions" : "Enable Levelup Mentions",
                    "toggle-alerts",
                    alerts ? "DANGER" : "SUCCESS",
                ),
            ),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
