import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from "discord.js"

export const createSelectMenu = (
    placeholder: string,
    customId: string,
    disabled: boolean,
    ...options: MessageSelectOptionData[]
) => {
    let components: MessageActionRow[] = []

    for (let i = 0; i < 5; i++) {
        const range = [i * 25, (i + 1) * 25]

        components[i] = new MessageActionRow().setComponents(
            new MessageSelectMenu()
                .setPlaceholder(placeholder)
                .setCustomId(customId + i)
                .setMaxValues(1)
                .setDisabled(disabled)
                .setOptions(...options.slice(...range)),
        )

        if (options.length <= (i + 1) * 25) break
    }

    return components
}
