import mongoose, { Document, model, Schema } from "mongoose"

const NUMBER = { type: Number, required: true }
const STRING = { type: String, required: true }

export type RewardsType = { roleId: string; level: number }
export type BoostsType = { roleId: string; amount: number }

export interface GuildDataType extends Document {
    guildId: string
    levelup: {
        channelId: string
        message: string
    }
    rewards: RewardsType[]
    boosts: BoostsType[]
}

const userSchema = new Schema({
    guildId: STRING,
    levelup: {
        channelId: String,
        message: String,
    },
    rewards: { type: [{ level: NUMBER, roleId: STRING }], default: [] },
    boosts: { type: [{ amount: NUMBER, roleId: STRING }], default: [] },
})

export const GuildDB = model("GuildDB", userSchema, "Guilds")
