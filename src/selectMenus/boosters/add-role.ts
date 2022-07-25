import { MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import { client } from "../.."
import { color, modalTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { addBoost } from "../../functions/guildDB/boost"
import { addReward } from "../../functions/guildDB/reward"
import { SelectMenu } from "../../structures/SelectMenu"

export default new SelectMenu({
    id: "add-boost",
    async run(select, command) {
        const roleId = select.values[0]

        const modalData = new Modal()
            .setCustomId("add-boost")
            .setTitle("Add Booster Role")
            .setComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setLabel("Amount of XP you want boost.(In percentage)")
                            .setCustomId("amount")
                            .setPlaceholder("The amount must an integer.")
                            .setMaxLength(3)
                            .setMinLength(1)
                            .setStyle("SHORT")
                            .setRequired(true),
                    ],
                }),
            )

        select.showModal(modalData)

        const modal = await select.awaitModalSubmit({ time: modalTime }).catch(console.error)

        if (!modal) return timeOut("NOREPLY", { interaction: command })

        const value = modal.fields.getTextInputValue("amount").match(/[0-9]+/)[0]
        if (!value) return interactionReply(modal, `The amount must an integer.`)

        const amount = parseInt(value)

        modal.deferUpdate()

        await addBoost(select.guildId, amount, roleId)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Add Booster Role")
                .setDescription(`Members with the role <@&${roleId}>, will get ${amount}% more XP.`)
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
