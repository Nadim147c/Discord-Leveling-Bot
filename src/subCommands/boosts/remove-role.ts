import { Message } from "discord.js"
import { removeBoost } from "../../functions/guildDB/boost"
import { Confirmation } from "../../functions/message/confirmation"
import { edit } from "../../functions/message/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand({
    name: "remove-role",
    async callback(command) {
        const boostId = command.options.getInteger("id")

        const confirmation = new Confirmation({
            content: boostId
                ? `Are you sure that you want remove the boost with this id?`
                : `Are you sure that you want to remove all boosts of this server?`,
            input: command,
            method: "followUp",
            user: command.user,
            buttonName: "Yep!",
            denyButton: true,
            denyButtonName: "Nope",
        })

        confirmation.start(async interaction => {
            const message = interaction.message as Message
            const { boosts } = await removeBoost(command.guild.id, boostId)

            let content: string
            if (boosts?.length === 1) content = "The boost has been removed."
            else if (boosts?.length) content = "All boosts have been removed."
            else content = "Specified boost don't exist"

            edit(message, content)
        })
    },
})
