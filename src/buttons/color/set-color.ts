import {
    MessageActionRow,
    MessageEmbed,
    Modal,
    ModalMessageModalSubmitInteraction,
    TextInputComponent,
} from "discord.js"
import { client } from "../.."
import { color as embedColor, emojis, modalTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { colorSelector } from "../../functions/string/colorSelector"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: ["set-accent-color", "set-font-color"],
    async run(button, command) {
        let title: string

        switch (button.customId) {
            case "set-accent-color":
                title = "Set Accent Color"
                break
            case "set-font-color":
                title = "Set Font Color"
        }

        const modalData = new Modal()
            .setCustomId("set-color")
            .setTitle(title)
            .setComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setLabel("Give me the name or hex value of the color.")
                            .setCustomId("color")
                            .setPlaceholder("Example: white, #2f1 or #f21f3f")
                            .setMinLength(1)
                            .setStyle("SHORT")
                            .setRequired(true),
                    ],
                }),
            )

        button.showModal(modalData)

        const modal = (await button
            .awaitModalSubmit({ time: modalTime })
            .catch(console.error)) as ModalMessageModalSubmitInteraction

        if (!modal) return timeOut("NOREPLY", { interaction: command })

        const colorHex = colorSelector(modal.fields.getTextInputValue("color") || "")

        if (!colorHex)
            return interactionReply(modal, `${emojis.general.error} Color name or hex value is invalid.`, true)

        await modal.deferUpdate()

        const userData = await getOrCreateUserData(command.user.id)

        switch (button.customId) {
            case "set-accent-color":
                userData.color.accent = colorHex
                break
            case "set-font-color":
                userData.color.font = colorHex
                break
        }

        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(embedColor)
                .setTitle(title)
                .setDescription(`Color has be set to:`)
                .setImage(`https://via.placeholder.com/200/${colorHex.slice(1)}/${colorHex.slice(1)}.png`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        await button.reply({ embeds }).catch(console.error)

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

        await command.editReply({ components }).catch(console.error)
    },
})
