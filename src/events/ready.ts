import { devGuilds, status } from "../config"
import { ExtendedClient } from "../structures/Client"
import { Event } from "../structures/Event"

export default new Event("ready", async (client: ExtendedClient) => {
    const { activities, timeout } = status
    client.user.setActivity({ name: `to you.`, type: "LISTENING" })
    setInterval(_ => client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]), timeout)

    const commands = Array.from(client.commands.values())

    for (const guildId of devGuilds) {
        const guild = await client.guilds.fetch(guildId)
        if (!guild) return
        await guild.commands.set(commands).catch(console.error)
    }
})
