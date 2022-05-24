import { Document, model, Schema } from "mongoose"

const NUMBER = { type: Number, required: true, default: 0 }
const STRING = { type: String, required: true }
const DATE = { type: Date, required: true, default: new Date() }

export interface LevelDataType extends Document {
    userId: string
    guildId: string
    xp: number
    level: number
    messages: number
    lastUpdate: Date
    rank?: number
}

const schema = new Schema({
    userId: STRING,
    guildId: STRING,
    xp: NUMBER,
    level: NUMBER,
    messages: NUMBER,
    lastUpdate: DATE,
})

export const LevelDB = model("levels", schema, "Levels")
