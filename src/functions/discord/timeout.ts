import {
    ButtonInteraction,
    CommandInteraction,
    Interaction,
    Message,
    MessageActionRow,
    SelectMenuInteraction,
} from "discord.js"
import { createButton } from "./createButton"

type option = {
    message?: Message
    interaction?: CommandInteraction | ButtonInteraction | SelectMenuInteraction
}
export const timeOut = async (timeOutType: "DENY" | "TIMEOUT" | "NOREPLY", { message, interaction }: option) => {
    if (!message && !interaction) return

    let components: MessageActionRow[]
    switch (timeOutType) {
        case "TIMEOUT":
            components = [
                new MessageActionRow().setComponents(
                    createButton("User didn't replied to me.", "timeout", "SECONDARY", true),
                ),
            ]
            break
        case "NOREPLY":
            components = [
                new MessageActionRow().setComponents(
                    createButton("Command has been timed out.", "timeout", "SECONDARY", true),
                ),
            ]
            break
        case "DENY":
            components = [
                new MessageActionRow().setComponents(
                    createButton("User denied the confirmation.", "timeout", "SECONDARY", true),
                ),
            ]
            break
    }

    if (message) return message.edit({ components }).catch(console.error)
    if (interaction) return interaction.editReply({ components }).catch(console.error)
}
