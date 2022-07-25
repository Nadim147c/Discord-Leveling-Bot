import { LevelDataType, LevelDB } from "../../models/levels"

type funcType = (userId: string, guildId: string, getRank?: boolean) => Promise<LevelDataType>

export const getOrCreateLevelData: funcType = async (userId, guildId, getRank) => {
    let data: LevelDataType =
        (await LevelDB.findOne({ userId, guildId })) ?? (await LevelDB.create({ userId, guildId }))

    if (getRank)
        data.rank =
            (await LevelDB.find({ guildId }).sort({ xp: -1 }).exec()).findIndex((i) => i.userId === userId) + 1 ?? 0

    return data
}

export const getLevelData: funcType = async (userId, guildId, getRank) => {
    const data: LevelDataType = await LevelDB.findOne({ userId, guildId })

    if (getRank && data)
        data.rank =
            (await LevelDB.find({ guildId }).sort({ xp: -1 }).exec()).findIndex((i) => i.userId === userId) + 1 ?? 0

    return data as LevelDataType
}
