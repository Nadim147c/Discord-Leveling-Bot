import { LevelDataType, LevelDB } from "../../models/levels"

type funcType = (guildId: string, limit: number) => Promise<LevelDataType[]>
export const leaderboard: funcType = async (guildId, limit) => {
    const lb = await LevelDB.find({ guildId })
        .sort([["xp", "descending"]])
        .exec()

    return lb.slice(0, limit)
}
