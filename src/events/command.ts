import { Collection } from "discord.js"
import { client } from ".."
import { botPermissions, DEVs } from "../config"
import { followUp, interactionReply } from "../functions/message/message"
import { titleCase } from "../functions/string/titleCase"
import { Event } from "../structures/Event"
import { ExtendedCommand } from "../typings/Command"

export default new Event("interactionCreate", async (interaction: ExtendedCommand) => {
    if (!interaction.isCommand()) return

    // Bot Permission check
    for (const permission of botPermissions) {
        if (!interaction.guild.me.permissions.has(permission))
            return interaction
                .reply(`I need ${titleCase(botPermissions.join(", "))} permissions to work properly.`)
                .catch(console.error)
    }

    const command = client.commands.get(interaction.commandName)

    if (!command) return interactionReply(interaction, "Error finding the command.", true)

    // Ephemeral Commands
    command.ephemeral
        ? await interaction.deferReply({ ephemeral: true }).catch(console.error)
        : await interaction.deferReply().catch(console.error)

    // Developer Check
    if (command.devOnly && !DEVs.includes(interaction.user.id))
        return followUp(interaction, "Your are not allowed to use this command", 8)

    // Cool Down Check
    const { coolDown } = client
    if (!coolDown.has(command.name)) coolDown.set(command.name, new Collection())

    const CurrentTime = Date.now()
    const timestamps = coolDown.get(command.name)
    const coolDownAmount = (command.coolDown || 3) * 1000

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + coolDownAmount

        if (CurrentTime < expirationTime) {
            const timeLeft = (expirationTime - CurrentTime) / 1000
            return followUp(
                interaction,
                `Wait **${timeLeft.toFixed(1)}**s before reusing the \`${command.name}\` command.`
            )
        }
    }

    timestamps.set(interaction.user.id, CurrentTime)
    setTimeout(() => timestamps.delete(interaction.user.id), coolDownAmount)

    // Permission Check
    if (command.memberPermissions?.length) {
        const permissions = command.memberPermissions.filter(x => !interaction.member.permissions.has(x))
        if (permissions.length)
            return followUp(
                interaction,
                `You need ${titleCase(permissions.join(", "))} permission(s) to execute this command!`,
                8
            )
    }

    try {
        command.run(interaction)
    } catch (error) {
        console.log(error)
    }
})