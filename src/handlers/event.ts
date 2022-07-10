import { ClientEvents } from "discord.js"
import { readdirSync } from "fs"
import { ExtendedClient } from "../structures/Client"
import { Event } from "../structures/Event"

export default async (client: ExtendedClient) => {
    const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")
    const events = readdirSync(`${__dirname}/../events`).filter(filter)
    for (let file of events) {
        const module: Event<keyof ClientEvents> = await client.importFile(`${__dirname}/../events/${file}`)
        client.on(module.event, module.execute)
    }
}
