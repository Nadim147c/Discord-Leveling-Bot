import { MessageSelectOptionData, NewsChannel, Role, TextChannel, VoiceChannel } from "discord.js"
import { emojis } from "../../config"

export const getSelectOptionsFormChannel = (channel: TextChannel | NewsChannel | VoiceChannel) => {
    const { news, news_looked, text, text_looked, voice, voice_looked, rule } = emojis.channel

    const looked = !channel
        .permissionsFor(channel.guild.roles.cache.find((x) => x.name === "@everyone"))
        .has("VIEW_CHANNEL")

    let emoji: string = null
    switch (channel.type) {
        case "GUILD_TEXT":
            emoji = looked ? text_looked : text
            break
        case "GUILD_NEWS":
            emoji = looked ? news_looked : news
            break
        case "GUILD_VOICE":
            emoji = looked ? voice_looked : voice
            break
    }

    if (channel.guild.rulesChannelId === channel.id) emoji = rule

    let description: string = null

    if (channel.type !== "GUILD_VOICE" && channel.topic) description = channel.topic.slice(0, 90)

    return { label: channel.name, value: channel.id, emoji, description } as MessageSelectOptionData
}

export const getSelectOptionsFormRole = (role: Role) => {
    const { black, blue, green, red, white, noColor } = emojis.roles

    let hex = role.hexColor as string
    let emoji: string

    if (hex.startsWith("#")) hex = hex.substring(1)
    if (hex.length === 3 || hex.length === 4) hex = hex.split("").reduce((a, v) => a + v + v, "")
    if (hex.length === 8) hex = hex.slice(0, 6)

    const rgb = parseInt(hex, 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

    switch ([r, g, b].sort((a, b) => b - a)[0]) {
        case r:
            emoji = red
            break
        case g:
            emoji = green
            break
        case b:
            emoji = blue
            break
    }

    if (luma > 220) emoji = white
    if (luma < 40) emoji = black
    if (role.color === 0) emoji = noColor

    return { label: role.name, value: role.id, emoji } as MessageSelectOptionData
}
