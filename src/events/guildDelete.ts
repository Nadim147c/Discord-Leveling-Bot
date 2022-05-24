import { GuildDB } from "../models/guild"
import { LevelDB } from "../models/levels"
import { Event } from "../structures/Event"

export default new Event("guildDelete", async guild => {
    await LevelDB.deleteMany({ guildId: guild.id })
    await GuildDB.findOneAndDelete({ _id: guild.id })
})
