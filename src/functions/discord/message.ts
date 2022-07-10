import {
    ButtonInteraction,
    ColorResolvable,
    CommandInteraction,
    Message,
    MessageComponentInteraction,
    MessageEmbed,
    SelectMenuInteraction,
    TextBasedChannel,
    User,
} from "discord.js"

const logError = (error: Error) => console.error(error.message)

const defaultColor = "#2f3136"
let embeds: MessageEmbed[]

export const followUp = async (
    interaction: CommandInteraction,
    content: string,
    time?: number,
    color: ColorResolvable = defaultColor
) => {
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await interaction.followUp({ embeds }).catch(logError)) as Message

    if (!message) return

    const deleteMessage = () => message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}

export const interactionReply = async (
    interaction: CommandInteraction | SelectMenuInteraction | ButtonInteraction | MessageComponentInteraction,
    content: string,
    ephemeral?: boolean,
    time?: number,
    color: ColorResolvable = defaultColor
) => {
    if (!ephemeral) ephemeral = false
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await interaction.reply({ embeds, ephemeral }).catch(logError)) as unknown as Message

    if (!message) return

    const deleteMessage = () => message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}

export const messageReply = async (
    message: Message,
    content: string,
    allowedMentions?: boolean,
    time?: number,
    color: ColorResolvable = defaultColor
) => {
    if (!color) color = defaultColor
    if (!allowedMentions) allowedMentions = false
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const newMessage = (await message
        .reply({ embeds, allowedMentions: { repliedUser: allowedMentions } })
        .catch(logError)) as unknown as Message

    if (!newMessage) return

    const deleteMessage = () => newMessage.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return newMessage
}

export const send = async (
    channel: User | TextBasedChannel,
    content: string,
    time?: number,
    color: ColorResolvable = defaultColor
) => {
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await channel.send({ embeds }).catch(logError)) as Message

    if (!message) return

    const deleteMessage = () => message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}

export const edit = async (message: Message, content: string, time?: number, color: ColorResolvable = defaultColor) => {
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    await message.edit({ embeds, content: " ", components: [], files: [] }).catch(logError)

    const deleteMessage = () => message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}
