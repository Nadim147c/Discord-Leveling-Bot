import { Command } from "../../structures/Command"
import {
    EmbedField,
    Message,
    MessageActionRow,
    MessageEmbed,
    MessageSelectMenu,
    MessageSelectOptionData,
    SelectMenuInteraction,
} from "discord.js"
import { color } from "../../config"
import { client } from "../.."
import { interactionReply } from "../../functions/discord/message"
import { disableComponents } from "../../functions/discord/disableComponents"

export default new Command({
    name: "help",
    description: "Get list of commands and other info.",
    aliases: ["commands", "info"],
    async execute(command) {
        const commandsInfo = Array.from(client.commandsInfo.values())

        const fields = commandsInfo.map((info) => ({
            name: `${info.emoji} ${info.name}`,
            value: info.commands.map((x) => `\`${x}\``).join(", "),
        }))

        let embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle(client.user.username)
                .setDescription(
                    "This is a leveling bot. Member will get a random amount XP when they chat. Members will get XP both text and voice chat.",
                )
                .setFields(...fields),
        ]

        const options: MessageSelectOptionData[] = commandsInfo.map((info, i) => ({
            label: info.name,
            value: `${i}`,
            description: `Get more info about ${info.name.toLowerCase()} commands.`,
            emoji: info.emoji,
        }))

        let components = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId("help-command")
                    .setMaxValues(1)
                    .setPlaceholder("Get more info about commands of each category.")
                    .setOptions(...options),
            ),
        ]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message

        if (!message) return

        const collector = message.createMessageComponentCollector({ idle: 1000 * 60 })

        collector.on("collect", async (interaction: SelectMenuInteraction): Promise<any> => {
            if (interaction.user.id !== command.user.id) {
                collector.collected.delete(interaction.id)
                return interactionReply(
                    interaction,
                    `This command is called by ${command.user}. Use \`/help\` to get more info.`,
                    true,
                )
            }
            interaction.deferUpdate()

            const value = parseInt(interaction.values[0])
            const category = commandsInfo[value]

            const fields: EmbedField[] = category.commands.map((commandName) => {
                const cmd = client.commands.get(commandName)

                let value = cmd.description

                if (cmd.aliases?.length) {
                    const aliases = cmd.aliases.join(", ")
                    value += `\n> Alias(es): ${aliases}`
                }

                return { name: commandName, value, inline: false }
            })

            const embeds = [
                new MessageEmbed()
                    .setColor(color)
                    .setTitle(category.name + " commands")
                    .setFields(...fields),
            ]

            message.edit({ embeds }).catch(console.error)
        })

        collector.on("end", async (): Promise<any> => await disableComponents(components, { message }))
    },
})
