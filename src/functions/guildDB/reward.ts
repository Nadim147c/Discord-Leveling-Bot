import { getOrCreateGuildData } from "./getData"

export const addReward = async (guildId: string, level: number, roleId: string) => {
    const guildData = await getOrCreateGuildData(guildId)

    let index = guildData.rewards.length

    guildData.rewards.push({ roleId, level })
    guildData.save()

    const rewards = guildData.rewards[0]
    return { guildData, index, rewards }
}

export const removeReward = async (guildId: string, index?: number) => {
    const guildData = await getOrCreateGuildData(guildId)

    if (index) {
        const rewards = guildData.rewards.filter((_, i) => i === index)
        guildData.rewards = guildData.rewards.filter((_, i) => i !== index)
        guildData.save()
        return { guildData, rewards }
    }

    const { rewards } = guildData
    guildData.rewards = []
    guildData.save()
    return { guildData, rewards }
}
