import { createCanvas, loadImage } from "canvas"
import { MessageAttachment, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { fitCover } from "../../functions/canvas/fitImage"
import { followUp } from "../../functions/discord/message"
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

    async execute(command) {
        const backgroundImageLink = command.options.getString("url")

        let userData = await getOrCreateUserData(command.user.id)

        if (backgroundImageLink == "reset") {
            userData.backgroundImage = null
            userData.save()
            return followUp(command, "Your backgroundImage has been removed.")
        }

        const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

        if (!backgroundImageLink.match(regex)) return followUp(command, "Invalid backgroundImage url.")

        const image = await loadImage(backgroundImageLink).catch(console.error)
        if (!image)
            return followUp(command, "Failed to load the image change. Try changing the format or use different image.")

        const canvas = createCanvas(1000, 250)
        const ctx = canvas.getContext("2d")

        userData.backgroundImage = backgroundImageLink
        userData.save()

        fitCover(canvas, ctx, image)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setDescription("Your background image has been changed.")
                .setImage("attachment://Background.png"),
        ]
        const files = [new MessageAttachment(canvas.toBuffer(), "Background.png")]

        command.followUp({ embeds, files }).catch(console.error)
    },
})
