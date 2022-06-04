import { delete_level_DB_on_guildDelete } from "../config"
import { GuildDB } from "../models/guild"
import { LevelDB } from "../models/levels"
import { Event } from "../structures/Event"

export default new Event("guildDelete", async guild => {
    if (delete_level_DB_on_guildDelete) await LevelDB.deleteMany({ guildId: guild.id })
    await GuildDB.findOneAndDelete({ _id: guild.id })
})
