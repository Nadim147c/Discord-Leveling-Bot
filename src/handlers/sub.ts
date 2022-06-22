import { ExtendedClient } from "../structures/Client"
import { readdirSync } from "fs"
import { SubCommandType } from "../typings/commands"
import { Collection } from "discord.js"

export default (client: ExtendedClient) => {
    const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")

    const path = `${__dirname}/../subCommands/`
    readdirSync(path).forEach(async (dir: string) => {
        const commandFiles = readdirSync(`${path}/${dir}`).filter(filter)

        const collection = new Collection()
        for (const file of commandFiles) {
            const command: SubCommandType = await client.importFile(`${path}/${dir}/${file}`)
            collection.set(command.name, command)
        }
    })
}
