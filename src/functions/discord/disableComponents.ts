import { Message, MessageActionRow, MessageComponentInteraction } from "discord.js"

interface inter extends MessageComponentInteraction {
    message: Message
}

type options = { interaction?: inter; message?: Message }

export const disableComponents = async (components: MessageActionRow[], { interaction, message }: options) => {
    components.forEach((x) => x.components.forEach((y) => (y.disabled = true)))
    if (interaction) await interaction.message.edit({ components }).catch(console.error)
    if (message) await message.edit({ components }).catch(console.error)
    return components
}
