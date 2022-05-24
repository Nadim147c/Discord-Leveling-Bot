import { Command } from "../../structures/Command"
import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { client } from "../.."

export default new Command({
    name: "help",
    description: "Get list of command.",
    async run(command) {
        const categories = [...new Set([...client.commands.values()].map(command => command.category))]

        const fields = categories.map(category => {
            const categoryCommands = client.commands.filter(cmd => cmd.category === category)
            return { name: category, value: [...categoryCommands.values()].map(cmd => `\`${cmd.name}\``).join(", ") }
        })

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("A list of all available commands.")
                .setFields(...fields),
        ]

        command.followUp({ embeds }).catch(console.error)
    },
})
