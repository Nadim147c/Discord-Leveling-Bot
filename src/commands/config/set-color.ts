import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/discord/message"
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
            name: "background",
            description: "Name or hex code of a color.",
            required: false,
        },
    ],

    async execute(command) {
        const accentColor = command.options.getString("accent")
        const backgroundColor = command.options.getString("background")

        if (!accentColor && !backgroundColor) return followUp(command, "No perimeter is found.")

        const userData = await getOrCreateUserData(command.user.id)

        const accent = accentColor ? colorSelector(accentColor) : null
        const background = backgroundColor ? colorSelector(backgroundColor) : null

        if (accent === "error") return followUp(command, "Invalid accent color.")
        if (background === "error") return followUp(command, "Invalid background color.")

        if (accent) userData.color.accent = accent
        if (background) userData.color.background = background
        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Color Change")
                .setDescription(
                    `Accent Color: ${accent || "Unchanged"}
                    Background Color: ${background || "Unchanged"}`
                ),
        ]

        return command.followUp({ embeds }).catch(console.error)
    },
})
