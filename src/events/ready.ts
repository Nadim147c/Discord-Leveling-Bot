import { devGuilds } from "../config"
import { ExtendedClient } from "../structures/Client"
import { Event } from "../structures/Event"

export default new Event("ready", async (client: ExtendedClient) => {
    const commands = Array.from(client.commands.values())

    for (const guildId of devGuilds) {
        const guild = await client.guilds.fetch(guildId)
        await guild.commands.set(commands).catch(console.error)
    }
})
