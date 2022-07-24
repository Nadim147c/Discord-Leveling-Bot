import { interactionReply } from "../../functions/discord/message"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: ["remove-accent-color", "remove-font-color"],
    async run(button, command) {
        button.deferUpdate()

        const userData = await getOrCreateUserData(command.user.id)

        let type: string

        switch (button.customId) {
            case "remove-accent-color":
                userData.color.accent = null
                type = "Accent"
                break
            case "remove-font-color":
                userData.color.font = null
                type = "Font"
                break
        }

        userData.save()

        await interactionReply(button, `${type} color has been removed.`, true)
    },
})
