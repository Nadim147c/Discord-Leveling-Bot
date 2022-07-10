import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
export default new Command({
    name: "ping",
    description: "Get the ping of the bot.",
    async execute(command) {
        followUp(command, `**Ping:** \n\`\`\`${command.client.ws.ping} ms\`\`\``)
    },
})
