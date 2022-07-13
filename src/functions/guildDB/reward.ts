import { getOrCreateGuildData } from "./getData"
import { saveGuildData } from "./savaData"

export const addReward = async (guildId: string, level: number, roleId: string) => {
    const guildData = await getOrCreateGuildData(guildId)

    let index = guildData.rewards.length

    guildData.rewards.push({ roleId, level })
    await saveGuildData(guildData)

    const rewards = guildData.rewards[0]
    return { guildData, index, rewards }
}

export const removeReward = async (guildId: string, index?: number) => {
    const guildData = await getOrCreateGuildData(guildId)

    if (index) {
        const rewards = guildData.rewards.filter((_, i) => i === index)
        guildData.rewards = guildData.rewards.filter((_, i) => i !== index)
        await saveGuildData(guildData)
        return { guildData, rewards }
    }

    const { rewards } = guildData
    guildData.rewards = []
    await saveGuildData(guildData)
    return { guildData, rewards }
}
