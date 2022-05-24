import { Schema, model, Document } from "mongoose"

const STRING = { type: String, required: true }

export interface UserDataType extends Document {
    _id: string
    color: string
    banner: string
}

const schema = new Schema({
    _id: STRING,
    color: String,
    banner: String,
})

export const UserDB = model("UserDB", schema, "Users")
