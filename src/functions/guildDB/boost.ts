import { getOrCreateGuildData } from "./getData"

export const addBoost = async (guildId: string, amount: number, roleId: string) => {
    const guildData = await getOrCreateGuildData(guildId)

    let index = guildData.boosts.length

    guildData.boosts.push({ roleId, amount })
    guildData.save()

    const boosts = guildData.boosts[0]
    return { guildData, index, boosts }
}

export const removeBoost = async (guildId: string, index?: number) => {
    const guildData = await getOrCreateGuildData(guildId)

    if (index) {
        const boosts = guildData.boosts.filter((_, i) => i === index)
        guildData.boosts = guildData.boosts.filter((_, i) => i !== index)
        guildData.save()
        return { guildData, boosts }
    }

    const { boosts } = guildData
    guildData.boosts = []
    guildData.save()
    return { guildData, boosts }
}
