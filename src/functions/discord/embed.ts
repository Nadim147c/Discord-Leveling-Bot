import { EmbedAuthorData, EmbedFooterData, User } from "discord.js"

export const getFooter = (user: User): EmbedFooterData => ({
    text: user.tag,
    iconURL: user.displayAvatarURL({ dynamic: false }),
})

export const getAuthor = (user: User): EmbedAuthorData => ({
    name: user.tag,
    iconURL: user.displayAvatarURL({ dynamic: false }),
})
