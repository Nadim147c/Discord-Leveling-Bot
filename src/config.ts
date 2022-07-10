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

export const purge_DB_on_guildDelete = false

// to detect spam
export const spamConfig = { time: 3, amount: 3, delete: true, xp: 100 }

// voiceleveling
export const xpPerMin = 10

// Xp per message
export const messageXp = {
    min: 5,
    max: 20,
}

// All required permission for bot.
export const botPermissions: PermissionString[] = [
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "MANAGE_MESSAGES",
    "MANAGE_ROLES",
]
