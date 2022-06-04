import { UserDataType, UserDB } from "../../models/user"

type funcType = (userId: string) => Promise<UserDataType>

export const getOrCreateUserData: funcType = async userId => {
    let data: UserDataType = await UserDB.findOne({ userId })

    return data ? data : ((await UserDB.create({ userId })) as UserDataType)
}

export const getUserData: funcType = async userId => (await UserDB.findOne({ userId })) as UserDataType
