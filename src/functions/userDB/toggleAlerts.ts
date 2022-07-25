import { getOrCreateUserData } from "./getData"

export const toggleAlerts = async (userId: string) => {
    const userData = await getOrCreateUserData(userId)

    userData.levelup_mention = userData.levelup_mention ? false : true

    userData.save()

    return userData
}
