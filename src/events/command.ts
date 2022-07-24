import { Collection } from "discord.js"
import { client } from ".."
import { botPermissions, developers } from "../config"
import { followUp, interactionReply } from "../functions/discord/message"
import { titleCase } from "../functions/string/titleCase"
import { Event } from "../structures/Event"
import { ExtendedCommand } from "../typings/Commands"

export default new Event("interactionCreate", async (interaction: ExtendedCommand) => {
    if (!interaction.isCommand()) return

    const { guild, commandName, member, user } = interaction

    // Bot Permission check
    for (const permission of botPermissions) {
        if (!guild.me.permissions.has(permission))
            return interaction
                .reply(`I need ${titleCase(botPermissions.join(", "))} permissions to work properly.`)
                .catch(console.error)
    }

    const command = client.commands.get(commandName)

    if (!command) return interactionReply(interaction, "Error finding the command.", true)

    // Ephemeral Commands
    command.ephemeral
        ? await interaction.deferReply({ ephemeral: true }).catch(console.error)
        : await interaction.deferReply().catch(console.error)

    // Developer Check
    if (command.devOnly && !developers.includes(user.id))
        return followUp(interaction, "Your are not allowed to use this command", 8)

    // Cool Down Check
    const { timeout: coolDown } = client

    if (!coolDown.has(command.name)) coolDown.set(command.name, new Collection())

    const CurrentTime = Date.now()
    const timestamps = coolDown.get(command.name)
    const coolDownAmount = (command.timeout || 3) * 1000

    if (timestamps.has(user.id)) {
        const expirationTime = timestamps.get(user.id) + coolDownAmount

        if (CurrentTime < expirationTime) {
            const timeLeft = (expirationTime - CurrentTime) / 1000
            return followUp(
                interaction,
                `Wait **${timeLeft.toFixed(1)}**s before reusing the \`${command.name}\` command.`,
            )
        }
    }

    timestamps.set(interaction.user.id, CurrentTime)

    setTimeout(() => timestamps.delete(interaction.user.id), coolDownAmount)

    // Permission Check
    if (command.memberPermissions?.length) {
        const permissions = command.memberPermissions.filter((x) => !member.permissions.has(x))

        const permissionName = titleCase(permissions.join(", "))

        if (permissions.length)
            return followUp(interaction, `You need ${permissionName} permission(s) to execute this command!`, 8)
    }

    try {
        command.execute(interaction)
    } catch (error) {
        console.log(error)
    }
})
