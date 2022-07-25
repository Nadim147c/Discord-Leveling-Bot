import { client } from "../.."
import { GuildDataType, GuildDB } from "../../models/guild"

type funcType = (guildId: string) => Promise<GuildDataType>

export const getOrCreateGuildData: funcType = async (guildId) => {
    const data: GuildDataType =
        client.guildData.get(guildId) ??
        (await GuildDB.findOne({ guildId })) ??
        ((await GuildDB.create({ guildId })) as GuildDataType)

    client.guildData.set(guildId, data)
    return data
}

export const getGuildData: funcType = async (guildId) => {
    let guildData = client.guildData.get(guildId)
    if (!guildData) guildData = await GuildDB.findOne({ guildId })
    if (guildData) client.guildData.set(guildId, guildData)
    return guildData
}
