import { getOrCreateGuildData } from "./getData"
import { saveGuildData } from "./savaData"

export const addBoost = async (guildId: string, amount: number, roleId: string) => {
    const guildData = await getOrCreateGuildData(guildId)

    let index = guildData.boosts.length

    guildData.boosts.push({ roleId, amount })
    await saveGuildData(guildData)

    const boosts = guildData.boosts[0]
    return { guildData, index, boosts }
}

export const removeBoost = async (guildId: string, index?: number) => {
    const guildData = await getOrCreateGuildData(guildId)

    if (index) {
        const boosts = guildData.boosts.filter((_, i) => i === index)
        guildData.boosts = guildData.boosts.filter((_, i) => i !== index)
        await saveGuildData(guildData)
        return { guildData, boosts }
    }

    const { boosts } = guildData
    guildData.boosts = []
    await saveGuildData(guildData)
    return { guildData, boosts }
}
