import { MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import { client } from "../.."
import { color, modalTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { timeOut } from "../../functions/discord/timeout"
import { setLevelUp } from "../../functions/guildDB/levelup"
import { getOrCreateLevelData } from "../../functions/levels/getData"
import { replaceVariables } from "../../functions/string/replaceVariables"
import button from "../../handlers/button"
import { SelectMenu } from "../../structures/SelectMenu"

export default new SelectMenu({
    id: "set-levelup-msg",
    async run(select, command) {
        const modalData = new Modal()
            .setCustomId("set-levelup-msg")
            .setTitle("Set Levelup message")
            .setComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setLabel("What you want to send to member on levelup?")
                            .setCustomId("content")
                            .setPlaceholder(
                                "Type MENTION, NICKNAME, USERNAME, USER_TAG, USER_LEVEL, USER_XP to use dynamic values.",
                            )
                            .setMinLength(1)
                            .setStyle("PARAGRAPH")
                            .setRequired(true),
                    ],
                }),
            )

        select.showModal(modalData)

        const modal = await select.awaitModalSubmit({ time: modalTime }).catch(console.error)

        if (!modal) return timeOut("NOREPLY", { interaction: command })

        modal.deferUpdate()

        const message = modal.fields.getTextInputValue("content")
        const channelId = select.values[0]

        await setLevelUp(select.guildId, channelId, message)

        const levelData = await getOrCreateLevelData(select.user.id, select.guildId)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Set Levelup Message")
                .setDescription(
                    `Here what this message will look like when someone levelup:\n${replaceVariables(
                        message,
                        select.member,
                        levelData,
                        true,
                    )}`,
                )
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
