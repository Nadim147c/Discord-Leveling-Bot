import { GuildDataType, GuildDB } from "../../models/guild"

type funcType = (guildId: string) => Promise<GuildDataType>

export const getOrCreateGuildData: funcType = async guildId => {
    const data: GuildDataType = await GuildDB.findOne({ _id: guildId })
    return data ? data : ((await GuildDB.create({ _id: guildId })) as GuildDataType)
}

export const getGuildData: funcType = async guildId => await GuildDB.findOne({ _id: guildId })
