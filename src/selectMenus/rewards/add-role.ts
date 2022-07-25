import { MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import { client } from "../.."
import { color, modalTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { addReward } from "../../functions/guildDB/reward"
import { SelectMenu } from "../../structures/SelectMenu"

export default new SelectMenu({
    id: "add-reward",
    async run(select, command) {
        const roleId = select.values[0]

        const modalData = new Modal()
            .setCustomId("add-reward")
            .setTitle("Add Reward Role")
            .setComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setLabel("Which level do you want to give this role?")
                            .setCustomId("level")
                            .setPlaceholder("The level must an integer.")
                            .setMaxLength(3)
                            .setMinLength(0)
                            .setStyle("SHORT")
                            .setRequired(true),
                    ],
                }),
            )

        select.showModal(modalData)

        const modal = await select.awaitModalSubmit({ time: modalTime }).catch(console.error)

        if (!modal) return timeOut("NOREPLY", { interaction: command })

        const value = modal.fields.getTextInputValue("level").match(/[0-9]+/)[0]
        if (!value) return interactionReply(modal, `The level must an integer.`)

        const level = parseInt(value)

        modal.deferUpdate()

        await addReward(select.guildId, level, roleId)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Add Reward Role")
                .setDescription(`Members will get <@&${roleId}> when they reach level ${level}.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(select.user))
                .setTimestamp(),
        ]

        const disableServerSettings = select.member.permissions.has("ADMINISTRATOR") ? false : true
        const components = [
            new MessageActionRow().setComponents(
                createButton("Profile Settings", "profile-settings"),
                createButton("Server Settings", "guild-settings", "SECONDARY", disableServerSettings),
            ),
        ]

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
