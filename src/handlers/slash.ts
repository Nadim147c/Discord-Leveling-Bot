import { ExtendedClient } from "../structures/Client"
import { readdirSync } from "fs"
import { categoryInfo, CommandType } from "../typings/Commands"

export default (client: ExtendedClient) => {
    const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")

    const path = `${__dirname}/../commands`
    readdirSync(path).forEach(async (dir: string) => {
        const fileList = readdirSync(`${path}/${dir}`)
        const commandFiles = fileList.filter(filter)

        const categoryInfo: categoryInfo = (await import(`${path}/${dir}/config.json`).catch(console.error))
            ?.default ?? {
            name: dir,
            emoji: "❔",
            commands: [],
        }

        for (const file of commandFiles) {
            const command: CommandType = await client.importFile(`${path}/${dir}/${file}`)
            if (!command.name) return

            if (!categoryInfo.commands.some((cmd) => cmd === command.name)) categoryInfo.commands.push(command.name)

            client.commands.set(command.name, command)

            if (command.aliases?.length) {
                command.aliases.forEach((alias) => {
                    const aliasCommand = Object.assign({}, command)
                    aliasCommand.name = alias
                    client.commands.set(alias, aliasCommand)
                })
            }
        }

        client.commandsInfo.set(categoryInfo.name, categoryInfo)
    })
}
