import { ActivitiesOptions, PermissionString } from "discord.js"

// Your Bot Token
export const bot_token = process.env.TOKEN

// MongoDB url to connect to database
export const mongodb_url = process.env.MONGODB

// Default Color Of Embeds
export const color = 3092790

// Developers account ID
export const DEVs: string[] = ["759472423807746059", "835893902804254730"]

// Your Server ID for bot to work
export const devGuilds: string[] = ["970403357904736276"]

export const delete_level_DB_on_guildDelete = false

// to detect spam
export const spamConfig = { time: 3, amount: 3, delete: true, xp: 100 }

// voiceleveling
export const xpPerSecond = 1 / 7

// All required permission for bot.
export const botPermissions: PermissionString[] = [
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "MANAGE_MESSAGES",
    "MANAGE_ROLES",
]

export const idle = 2 * 60 * 1000

// Status
export const status: { timeout: number; activities: ActivitiesOptions[] } = {
    timeout: 1000 * 60 * 5, // 5min
    activities: [
        {
            type: "WATCHING",
            name: "Your Messages.",
        },
        {
            type: "PLAYING",
            name: "with you.",
        },
    ],
}
