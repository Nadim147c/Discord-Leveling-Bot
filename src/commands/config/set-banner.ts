import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/message/message"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Command } from "../../structures/Command"

export default new Command({
    name: "set-banner",
    description: "Set a banner of your rank card.",
    options: [
        {
            type: "STRING",
            name: "url",
            description: 'Banner must be a link or "reset" to reset the banner.',
            required: true,
        },
    ],

    async run(command) {
        const bannerLink = command.options.getString("url")

        let userData = await getOrCreateUserData(command.user.id)

        if (bannerLink == "reset") {
            userData.banner = null
            userData.save()
            return followUp(command, "Your banner has been removed.")
        }

        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        const regex = new RegExp(expression)

        if (!bannerLink.match(regex)) return followUp(command, "Invalid banner url.")

        userData.banner = bannerLink
        userData.save()

        const embeds = [
            new MessageEmbed().setColor(color).setDescription("You banner has been changed.").setImage(bannerLink),
        ]

        command.followUp({ embeds }).catch(console.error)
    },
})
