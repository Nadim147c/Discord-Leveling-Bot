import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { titleCase } from "../../functions/string/titleCase"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: ["remove-bg-color", "remove-bg-image"],
    async run(button, command) {
        const userData = await getOrCreateUserData(command.user.id)

        let type: string
        switch (button.customId) {
            case "remove-bg-color":
                type = "color"
                userData.background.color = null
                break
            case "remove-bg-image":
                type = "image"
                userData.background.image = null
                break
        }

        userData.save()

        await interactionReply(button, `Background ${type} has been removed.`, true)
    },
})
