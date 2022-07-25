import { messageXp } from "../../config"
import { getOrCreateLevelData } from "./getData"

export const getRandomXp = (min?: number, max?: number) =>
    Math.round(Math.random() * ((max ?? messageXp.max) - (min ?? messageXp.min))) + (min ?? messageXp.min)

export const addXp = async (userId: string, guildId: string, xpAmount: number, type: "VOICE" | "TEXT") => {
    const levelData = await getOrCreateLevelData(userId, guildId)

    const currentLevel = levelData.level

    levelData.xp += xpAmount
    type === "TEXT" ? (levelData.textXp += xpAmount) : (levelData.voiceXp += xpAmount)

    levelData.level = Math.floor(0.1 * Math.sqrt(levelData.xp))
    levelData.messages++
    
    levelData.lastUpdate = new Date()
    type === "TEXT" ? (levelData.lastText = new Date()) : (levelData.lastVoice = new Date())

    levelData.save()

    let levelUp = levelData.level > currentLevel ? true : false

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
