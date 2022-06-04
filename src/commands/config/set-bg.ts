import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/message/message"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Command } from "../../structures/Command"

export default new Command({
    name: "set-background",
    description: "Set a background image of your rank card.",
    options: [
        {
            type: "STRING",
            name: "url",
            description: "background image must be a link.",
            required: true,
        },
    ],

    async run(command) {
        const backgroundImageLink = command.options.getString("url")

        let userData = await getOrCreateUserData(command.user.id)

        if (backgroundImageLink == "reset") {
            userData.backgroundImage = null
            userData.save()
            return followUp(command, "Your backgroundImage has been removed.")
        }

        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        const regex = new RegExp(expression)

        if (!backgroundImageLink.match(regex)) return followUp(command, "Invalid backgroundImage url.")

        userData.backgroundImage = backgroundImageLink
        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setDescription("You backgroundImage has been changed.")
                .setImage(backgroundImageLink),
        ]

        command.followUp({ embeds }).catch(console.error)
    },
})
