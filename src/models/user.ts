import { Schema, model, Document } from "mongoose"

const STRING = { type: String, required: true }

export interface UserDataType extends Document {
    userId: string
    color: {
        accent: string
        font: string
    }
    background: {
        color: string
        image: string
    }
    levelup_mention: boolean
}

const schema = new Schema({
    userId: STRING,
    color: {
        accent: String,
        font: String,
    },
    background: {
        color: String,
        image: String,
    },
    levelup_mention: Boolean,
})

export const UserDB = model("UserDB", schema, "Users")
