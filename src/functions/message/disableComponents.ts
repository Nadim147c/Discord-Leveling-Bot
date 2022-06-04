import { BaseMessageComponent, MessageActionRow, MessageActionRowComponent, MessageComponent } from "discord.js"

export const disableComponents = (components: MessageActionRow[]) => {
    components.forEach(raw => raw.components.forEach(component => (component.disabled = true)))
    return components
}
