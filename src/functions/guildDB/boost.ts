import { BoostsType } from "../../models/guild"
import { getOrCreateGuildData } from "./getData"
import { saveGuildData } from "./savaData"

export const addBoost = async (guildId: string, amount: number, roleId: string) => {
    const guildData = await getOrCreateGuildData(guildId)

    const boosts = { roleId, amount }

    guildData.boosts.push(boosts)

    await saveGuildData(guildData)

    return { guildData, boosts }
}

export const removeBoosts = async (guildId: string, ...indexes: number[]) => {
    const guildData = await getOrCreateGuildData(guildId)

    const removed: BoostsType[] = indexes.reduce((a, v) => [...a, ...guildData.boosts.splice(v, 1)], [])
    const boosts = guildData.boosts

    await saveGuildData(guildData)
    return { guildData, boosts, removed }
}

export const getBoosts = async (guildId: string) =>
    (await getOrCreateGuildData(guildId)).boosts.sort((a, b) => a.amount - b.amount)
