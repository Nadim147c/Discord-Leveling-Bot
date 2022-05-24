import { getOrCreateLevelData } from "./getData"

export const getRandomXp = (min?: number, max?: number) =>
    Math.round(Math.random() * ((max || 20) - (min || 5))) + (min || 5)

export const addXp = async (userId: string, guildId: string, xpAmount: number) => {
    const levelData = await getOrCreateLevelData(userId, guildId)

    const currentLevel = levelData.level

    levelData.xp += xpAmount

    levelData.level = Math.floor(0.1 * Math.sqrt(levelData.xp))
    levelData.messages++
    levelData.lastUpdate = new Date()

    levelData.save()

    let levelUp = false

    if (levelData.level > currentLevel) levelUp = true
    return { levelData, levelUp }
}

export const removeXp = async (userId: string, guildId: string, xpAmount: number) => {
    const levelData = await getOrCreateLevelData(userId, guildId)

    if (xpAmount > levelData.xp) {
        await levelData.delete()
        return { levelData }
    }

    levelData.xp -= xpAmount
    levelData.level = Math.floor(0.1 * Math.sqrt(levelData.xp))

    return { levelData }
}

export const setXp = async (userId: string, guildId: string, xpAmount: number) => {
    const levelData = await getOrCreateLevelData(userId, guildId)

    levelData.xp += xpAmount
    levelData.level = Math.floor(0.1 * Math.sqrt(levelData.xp))
    levelData.lastUpdate = new Date()
    levelData.save()

    return { levelData }
}

export const getLevel = (xp: number) => Math.floor(0.1 * Math.sqrt(xp))
