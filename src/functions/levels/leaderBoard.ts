import { LevelDataType, LevelDB } from "../../models/levels"

type funcType = (guildId: string, limit: number) => Promise<LevelDataType[]>
export const leaderboard: funcType = async (guildId, limit) =>
    (await LevelDB.find({ guildId }).sort({ xp: -1 }).limit(limit).exec()) as LevelDataType[]
