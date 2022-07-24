import { freeSpace } from "../config"
import { GuildDB } from "../models/guild"
import { LevelDB } from "../models/levels"
import { Event } from "../structures/Event"

export default new Event("guildDelete", async (guild) => {
    if (freeSpace) {
        await LevelDB.deleteMany({ guildId: guild.id })
        await GuildDB.findOneAndDelete({ guildId: guild.id })
    }
})
