import { client } from "../.."
import { devGuilds } from "../../config"
import { followUp } from "../../functions/message/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "reload",
    description: "Reload all slash command in the server.",
    async callback(command) {
        const commands = Array.from(client.commands.values())

        //  Registering the slash commands in the server
        devGuilds.forEach(
            async guildId => await client.guilds.cache.get(guildId)?.commands?.set(commands)?.catch(console.error)
        )

        client.application.commands
            .set(commands)
            .then(commands => followUp(command, `Reloaded total ${commands.size}`))
            .catch(console.error)
    },
})
