import { MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import { client } from "../.."
import { color, modalTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
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

        await modal.deferUpdate()

        const userData = await getOrCreateUserData(command.user.id)

        userData.background.image = url

        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Set Background Image")
                .setDescription(`Background has be set to:`)
                .setImage(url)
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
