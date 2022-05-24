import { LevelDataType, LevelDB } from "../../models/levels"

type funcType = (userId: string, guildId: string, getRank?: boolean) => Promise<LevelDataType>

export const getOrCreateLevelData: funcType = async (userId, guildId, getRank) => {
    let data: LevelDataType = await LevelDB.findOne({ userId, guildId })

    data = data ? data : await LevelDB.create({ userId, guildId })

    if (getRank) {
        const lb: LevelDataType[] = await LevelDB.find({ guildId })
            .sort([["xp", "descending"]])
            .exec()

        data.rank = lb.findIndex(i => i.userId === userId) + 1
    }
    return data
}

export const getLevelData: funcType = async (userId, guildId, getRank) => {
    const data: LevelDataType = await LevelDB.findOne({ userId, guildId })

    if (getRank && data) {
        const lb: LevelDataType[] = await LevelDB.find({ guildId })
            .sort([["xp", "descending"]])
            .exec()

        data.rank = lb.findIndex(i => i.userId === userId) + 1
    }

    return data as LevelDataType
}
