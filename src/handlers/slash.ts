import { ExtendedClient } from "../structures/Client"
import { readdirSync } from "fs"
import { CommandType } from "../typings/command"

export default (client: ExtendedClient) => {
    const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")

    const path = `${__dirname}/../commands/`
    readdirSync(path).forEach(async (dir: string) => {
        const commandFiles = readdirSync(`${path}/${dir}`).filter(filter)

        for (const file of commandFiles) {
            const command: CommandType = await client.importFile(`${path}/${dir}/${file}`)
            if (!command.name) return

            command.category = dir

            client.commands.set(command.name, command)

            if (command.aliases?.length) {
                command.aliases.forEach(alias => {
                    const aliasCommand = Object.assign({}, command)
                    aliasCommand.name = alias
                    client.commands.set(alias, aliasCommand)
                })
            }
        }
    })
}
