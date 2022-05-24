import { getOrCreateLevelData } from "./getData"

export const addLevel = async (userId: string, guildId: string, level: number) => {
    const levelData = await getOrCreateLevelData(userId, guildId)

    levelData.level += level
    levelData.xp = levelData.level * levelData.level * 100
    levelData.lastUpdate = new Date()
    levelData.save()

    return { levelData }
}

export const setLevel = async (userId: string, guildId: string, level: number) => {
    const levelData = await getOrCreateLevelData(userId, guildId)

    levelData.level = level
    levelData.xp = level * level * 100
    levelData.lastUpdate = new Date()
    levelData.save()

    return { levelData }
}

export const getXp = (level: number) => level * level * 100
