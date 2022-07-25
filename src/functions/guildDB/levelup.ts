import { getOrCreateGuildData } from "./getData"
import { saveGuildData } from "./savaData"

export const setLevelUp = async (guildId: string, channelId: string, message: string) => {
    const guildData = await getOrCreateGuildData(guildId)

    guildData.levelup = { channelId, message }

    await saveGuildData(guildData)
}
