import { Schema, model, Document } from "mongoose"

const STRING = { type: String, required: true }

export interface UserDataType extends Document {
    userId: string
    color: {
        accent: string
        background: string
    }
    backgroundImage: string
}

const schema = new Schema({
    userId: STRING,
    color: {
        accent: String,
        background: String,
    },
    backgroundImage: String,
})

export const UserDB = model("UserDB", schema, "Users")
