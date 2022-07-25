import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color as embedColor } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { toggleAlerts } from "../../functions/userDB/toggleAlerts"
import { UserDataType } from "../../models/user"
import { Button } from "../../structures/Button"

export default new Button({
    id: ["profile-settings", "toggle-alerts"],
    async run(button, command) {
        let userData: UserDataType

        const toggle = button.customId !== "toggle-alerts"

        toggle
            ? (userData = await getOrCreateUserData(button.user.id))
            : (userData = await toggleAlerts(button.user.id))

        const embeds = [
            new MessageEmbed()
                .setColor(embedColor)
                .setTitle("Profile Settings")
                .setDescription(`Choose what you want change.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        const { levelup_mention, color, background } = userData

        const components = [
            new MessageActionRow().setComponents(
                createButton("Set Accent Color", "set-accent-color", "SUCCESS"),
                createButton("Remove Accent Color", "remove-accent-color", "DANGER", !color.accent),
                createButton("Set Font Color", "set-font-color", "SUCCESS"),
                createButton("Remove Font Color", "remove-font-color", "DANGER", !color.font),
            ),
            new MessageActionRow().setComponents(
                createButton("Set Background Color", "set-bg-color", "SUCCESS"),
                createButton("Remove Background Color", "remove-bg-color", "DANGER", !background.color),
                createButton("Set Background Image", "set-bg-image", "SUCCESS"),
                createButton("Remove Background Image", "remove-bg-image", "DANGER", !background.image),
            ),
            new MessageActionRow().setComponents(
                createButton(
                    levelup_mention ? "Disable Levelup Mentions" : "Enable Levelup Mentions",
                    "toggle-alerts",
                    levelup_mention ? "DANGER" : "SUCCESS",
                ),
            ),
        ]

        toggle
            ? button.deferUpdate()
            : await interactionReply(
                  button,
                  `Mention on levelup has been ${levelup_mention ? "enabled" : "disabled"}!`,
                  true,
              )

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
