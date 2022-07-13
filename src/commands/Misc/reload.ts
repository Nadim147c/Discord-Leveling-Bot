import { client } from "../.."
import { devGuild } from "../../config"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "reload",
    description: "Reload all slash command in the server.",
    devOnly: true,
    async execute(command) {
        const commands = Array.from(client.commands.values())

        //  Registering the slash commands in the server
        await client.guilds.cache.get(devGuild)?.commands?.set(commands)?.catch(console.error)

        const global = commands.filter((cmd) => !cmd.devOnly)

        const commandCollection = await client.application.commands.set(global).catch(console.error)

        if (commandCollection) return followUp(command, `Reloaded total ${commandCollection.size}`)

        followUp(command, `Error registering commands.`)
    },
})
