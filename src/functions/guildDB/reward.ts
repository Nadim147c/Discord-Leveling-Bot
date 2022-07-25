import { RewardsType } from "../../models/guild"
import { getOrCreateGuildData } from "./getData"
import { saveGuildData } from "./savaData"

export const addReward = async (guildId: string, level: number, roleId: string) => {
    const guildData = await getOrCreateGuildData(guildId)

    const rewards = { roleId, level }

    guildData.rewards.push(rewards)

    await saveGuildData(guildData)

    return { guildData, rewards }
}

export const removeRewards = async (guildId: string, indexes: number[]) => {
    const guildData = await getOrCreateGuildData(guildId)

    const removed: RewardsType[] = indexes.reduce((a, v) => [...a, ...guildData.rewards.splice(v, 1)], [])

    const rewards = guildData.rewards

    await saveGuildData(guildData)

    return { guildData, rewards, removed }
}

export const getRewards = async (guildId: string) =>
    (await getOrCreateGuildData(guildId)).rewards.sort((a, b) => a.level - b.level)
