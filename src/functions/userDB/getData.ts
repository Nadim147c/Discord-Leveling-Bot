import { UserDataType, UserDB } from "../../models/user"

type funcType = (userId: string) => Promise<UserDataType>

export const getOrCreateUserData: funcType = async _id => {
    let data: UserDataType = await UserDB.findOne({ _id })

    return data ? data : ((await UserDB.create({ _id })) as UserDataType)
}

export const getUserData: funcType = async _id => (await UserDB.findOne({ _id })) as UserDataType
