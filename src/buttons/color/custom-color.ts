import { MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import { client } from "../.."
import { color, emojis, modalTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: "custom-color",
    async run(button, command) {
        const modalData = new Modal()
            .setCustomId("custom-color")
            .setTitle("Custom Accent Color.")
            .setComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setLabel("Give me the hex value of the color.")
                            .setCustomId("color")
                            .setPlaceholder("Example: #2f1 or #f21f3f")
                            .setMaxLength(7)
                            .setMinLength(4)
                            .setStyle("SHORT")
                            .setRequired(true),
                    ],
                }),
            )

        button.showModal(modalData)

        const modal = await button.awaitModalSubmit({ time: modalTime }).catch(console.error)

        if (!modal) return timeOut("NOREPLY", { interaction: command })

        const regex = /^#([0-9a-f]{3}){1,2}$/i // color hex (#123 || #112233)

        const colorHex = modal.fields.getTextInputValue("color").match(regex)?.[0]

        if (!color) return interactionReply(modal, `${emojis.general.error} Hex value of the color is invalid.`, true)

        await modal.deferUpdate()

        const userData = await getOrCreateUserData(command.user.id)

        userData.color.accent = colorHex

        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Custom Color")
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
