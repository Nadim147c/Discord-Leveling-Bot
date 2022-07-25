import { MessageButton, MessageButtonStyle } from "discord.js"

export const createButton = (
    label: string,
    customId: string,
    style: MessageButtonStyle = "SECONDARY",
    disabled?: boolean,
    emoji?: string | null | false,
    url?: string,
) => {
    const button = new MessageButton().setLabel(label).setCustomId(customId).setStyle(style)
    if (style === "LINK" && url) button.setURL(url)
    if (emoji) button.setEmoji(emoji)
    if (disabled) button.setDisabled(disabled)
    return button
}
