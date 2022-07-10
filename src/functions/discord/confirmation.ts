import { error } from "console"
import {
    ButtonInteraction,
    Collector,
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageButtonStyle,
    MessageComponentInteraction,
    MessageEmbed,
    User,
    Collection,
} from "discord.js"
import { color } from "../../config"
import { edit, interactionReply } from "./message"

type optionType = {
    user: User
    embeds?: MessageEmbed[]
    content?: string
    buttonName?: string
    buttonStyle?: MessageButtonStyle
    denyButton?: boolean
    denyButtonName?: string
    input: Message | Interaction
    method: "send" | "followUp" | "reply" | "edit"
    timeOut?: number
    onDeny?: (interaction: ButtonInteraction) => any
    timeOutMessage?: string
}

export class Confirmation {
    constructor(option: optionType) {
        Object.assign(this, option)
    }

    async start(onConfirm: (Interaction: ButtonInteraction) => any) {
        const option: optionType = this as any
        if (!option.content && !option.embeds) throw new Error(`You must assign embed or content.`)

        const { user, input, method } = option

        const components = [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("confirmed")
                    .setStyle(option.buttonStyle || "SUCCESS")
                    .setLabel(option.buttonName || "Sure")
            ),
        ]

        if (option.denyButton) {
            components[0].components.push(
                new MessageButton()
                    .setCustomId("denied")
                    .setStyle("DANGER")
                    .setLabel(option.denyButtonName || "Never Mind!")
            )
        }

        let embeds = option.content
            ? [new MessageEmbed().setColor(color).setDescription(option.content)]
            : option.embeds

        const message: Message = await input[method]({ embeds, components }).catch(console.error)

        if (!message) return

        type CollectorType = Collector<string, MessageComponentInteraction>

        const time = option.timeOut ? option.timeOut * 1000 : 20 * 1000
        const collector: CollectorType = message.createMessageComponentCollector({ time })

        collector.on("collect", async (interaction: MessageComponentInteraction) => {
            if (interaction.user.id !== user.id) {
                collector.collected.delete(interaction.id)
                return interactionReply(interaction, `I asked for ${user}'s confirmation.`, true)
            }

            interaction.deferUpdate()

            if (interaction.customId !== "denied") return onConfirm(interaction as ButtonInteraction).catch(error)

            if (option.onDeny) option.onDeny(interaction as ButtonInteraction).catch(error)
        })

        collector.on("end", async (collection: Collection<string, MessageComponentInteraction>) => {
            if (collection.size !== 0) return

            edit(message, option.timeOutMessage || "Confirmation Timeout.")
        })
    }
}
