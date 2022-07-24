import { MessageActionRow } from "discord.js"

export const toggleComponents = (components: MessageActionRow[], disabled: boolean, ...customId: string[]) => {
    // to disable all components
    const regex = /(all|max|every)/gi

    regex.test(customId[0])
        ? components.forEach((row) => row.components.forEach((x) => (x.disabled = disabled)))
        : components.forEach((row) =>
              row.components.forEach((x) => (customId.some((y) => x.customId === y) ? (x.disabled = disabled) : null)),
          )

    return components
}
