import { MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import { client } from "../.."
import { color, emojis, modalTime } from "../../config"
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
            .setCustomId("color")
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

        const modal = await button.awaitModalSubmit({ time: modalTime }).catch(console.error)

        if (!modal) return timeOut("NOREPLY", { interaction: command })

        const regex = /^#([0-9a-f]{3}){1,2}$/i // color hex (#123 || #112233)

        const colorHex = colorSelector(modal.fields.getTextInputValue("color").match(regex)?.[0] || "")

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
                .setColor(color)
                .setTitle(title)
                .setDescription(`Color has be set to:`)
                .setImage(`https://via.placeholder.com/200/${colorHex.slice(1)}/${colorHex.slice(1)}.png`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        const disableServerSettings = button.member.permissions.has("ADMINISTRATOR") ? false : true
        const components = [
            new MessageActionRow().setComponents(
                createButton("Profile Settings", "profile-settings"),
                createButton("Server Settings", "guild-settings", "SECONDARY", disableServerSettings),
            ),
        ]

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
