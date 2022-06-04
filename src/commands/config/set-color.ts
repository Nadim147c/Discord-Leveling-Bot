import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/message/message"
import { colorSelector } from "../../functions/string/colorSelector"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Command } from "../../structures/Command"

export default new Command({
    name: "set-color",
    description: "Change color of your rank card.",
    options: [
        {
            type: "STRING",
            name: "accent",
            description: "Name or hex code of a color.",
            required: false,
        },
        {
            type: "STRING",
            name: "stroke",
            description: "Name or hex code of a color.",
            required: false,
        },
        {
            type: "STRING",
            name: "background",
            description: "Name or hex code of a color.",
            required: false,
        },
    ],

    async run(command) {
        const accentColor = command.options.getString("accent")
        const strokeColor = command.options.getString("stroke")
        const backgroundColor = command.options.getString("background")

        if (!accentColor && !strokeColor && !backgroundColor) return followUp(command, "No perimeter is found.")

        const userData = await getOrCreateUserData(command.user.id)

        const accent = accentColor ? colorSelector(accentColor) : null
        const stroke = strokeColor ? colorSelector(strokeColor) : null
        const background = backgroundColor ? colorSelector(backgroundColor) : null

        if (accent === "error") return followUp(command, "Invalid accent color.")
        if (stroke === "error") return followUp(command, "Invalid stroke color.")
        if (background === "error") return followUp(command, "Invalid background color.")

        if (accent) userData.color.accent = accent
        if (stroke) userData.color.accent = stroke
        if (background) userData.color.accent = background
        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Color Change")
                .setDescription(
                    `Accent Color: ${accent || "Unchanged"}
                    Stroke Color: ${stroke || "Unchanged"}
                    Background Color: ${background || "Unchanged"}`
                ),
        ]

        return command.followUp({ embeds }).catch(console.error)
    },
})
