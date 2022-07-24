import { getOrCreateUserData } from "./getData"

export const toggleAlerts = async (userId: string) => {
    const userData = await getOrCreateUserData(userId)

    userData.levelup_alert = userData.levelup_alert ? false : true

    userData.save()

    return userData.levelup_alert
}
