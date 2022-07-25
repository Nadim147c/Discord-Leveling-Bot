import { PermissionString } from "discord.js"

// Your Bot Token
export const bot_token = process.env.TOKEN

// MongoDB url to connect to database
export const mongodb_url = process.env.MONGODB

// Default Color Of Embeds
export const color = 3092790

// Developers account ID
export const developers: string[] = ["759472423807746059"]

// Your Server ID for bot to work
export const devGuild: string = "970403357904736276"

// Purge database on guild delete event/when bot is kicked from server
export const freeSpace = false

// Message Cool Down
export const messageCoolDown = 1000 * 20

// voice leveling
export const xpPerMin = 10

// Default idle time for components
export const idleTime = 1000 * 60 * 5 // 5min

// Default wait time for modal
export const modalTime = 1000 * 60 * 5 // 15min

// Xp per message
export const messageXp = {
    min: 5,
    max: 15,
}

// All required permission for bot.
export const botPermissions: PermissionString[] = [
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "MANAGE_MESSAGES",
    "MANAGE_ROLES",
]

export const emojis = {
    general: {
        warning: "⚠",
        error: "❌",
    },
    channel: {
        news: "1000085726463012904",
        news_looked: "1000087105617281155",
        text: "1000085724470718474",
        text_looked: "1000087081038659664",
        voice: "1000263614676086814",
        voice_looked: "1000263550704558170",
        rule: "1000085728514015362",
    },
    roles: {
        white: "⚪",
        black: "⚫",
        red: "🔴",
        green: "🟢",
        blue: "🔵",
        noColor: "⬜",
    },
}
