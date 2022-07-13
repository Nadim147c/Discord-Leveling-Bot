import { client } from "../.."
import { GuildDataType } from "../../models/guild"

export const saveGuildData = async (guildData: GuildDataType) => {
    client.guildData.set(guildData.guildId, guildData)
    await guildData.save()
}
