import { ActivitiesOptions } from "discord.js"
import { devGuild } from "../config"
import { ExtendedClient } from "../structures/Client"
import { Event } from "../structures/Event"

export default new Event("ready", async (client: ExtendedClient) => {
    const timeout = 1000 * 60 * 5 // 5min
    const activities: ActivitiesOptions[] = [
        {
            type: "PLAYING",
            name: `with ${client.guilds.cache.reduce((a, v) => a + v.memberCount, 0)} members.`,
        },
        {
            type: "LISTENING",
            name: "to you.",
        },
        {
            type: "WATCHING",
            name: "you!",
        },
    ]

    client.user.setActivity(activities[0])
    setInterval(() => client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]), timeout)

    const commands = Array.from(client.commands.values())

    const guild = await client.guilds.fetch(devGuild).catch(console.error)
    if (guild) await guild.commands.set(commands).catch(console.error)
})
