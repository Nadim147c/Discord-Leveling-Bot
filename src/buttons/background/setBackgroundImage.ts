import { MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import { client } from "../.."
import { color as embedColor, modalTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: "set-bg-image",
    async run(button, command) {
        const modalData = new Modal()
            .setCustomId("bg-image")
            .setTitle("Set Background Image")
            .setComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setLabel("Give me the URL of od the image.")
                            .setCustomId("image")
                            .setPlaceholder("An image URL.")
                            .setStyle("SHORT")
                            .setRequired(true),
                    ],
                }),
            )

        button.showModal(modalData)

        const modal = await button.awaitModalSubmit({ time: modalTime }).catch(console.error)

        if (!modal) return timeOut("NOREPLY", { interaction: command })

        const url = modal.fields.getTextInputValue("image")

        if (url.length > 2000) return interactionReply(modal, `The length of the URL is to large.`, true)

        const userData = await getOrCreateUserData(command.user.id)

        userData.background.image = url

        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(embedColor)
                .setTitle("Set Background Image")
                .setDescription(`Background has be set to:`)
                .setImage(url)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        await modal.reply({ embeds, ephemeral: true })

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

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
