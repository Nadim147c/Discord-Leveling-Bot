import { MessageEmbed } from "discord.js"
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
            name: "color",
            description: "Name or hex code of a color.",
            required: true,
        },
    ],
    async run(command) {
        const colorName = command.options.getString("color")

        const userData = await getOrCreateUserData(command.user.id)

        if (colorName === "reset") {
            userData.color = null
            userData.save()
            return followUp(command, "Your color is removed.")
        }

        const color = colorSelector(colorName)

        if (!color) return followUp(command, "Please give me a color name or hex code of a color.")

        userData.color = color
        userData.save()

        let embeds = [
            new MessageEmbed()
                .setDescription(`I have changed your color to:`)
                .setColor(color)
                .setThumbnail(`https://via.placeholder.com/20/${color.slice(1)}/${color.slice(1)}.png`),
        ]

        return command.followUp({ embeds }).catch(console.error)
    },
})
