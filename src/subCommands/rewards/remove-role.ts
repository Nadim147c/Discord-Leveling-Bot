import { Message } from "discord.js"
import { removeReward } from "../../functions/guildDB/reward"
import { Confirmation } from "../../functions/discord/confirmation"
import { edit } from "../../functions/discord/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand({
    name: "remove-role",
    async execute(command) {
        const rewardId = command.options.getInteger("id")

        const confirmation = new Confirmation({
            content: rewardId
                ? `Are you sure that you want remove the reward with this id?`
                : `Are you sure that you want to remove all rewards of this server?`,
            input: command,
            method: "followUp",
            user: command.user,
            buttonName: "Yep!",
            denyButton: true,
            denyButtonName: "Nope",
        })

        confirmation.start(async (interaction) => {
            const message = interaction.message as Message
            const { rewards } = await removeReward(command.guild.id, rewardId)

            let content: string
            if (rewards?.length === 1) content = "The reward has been removed."
            else if (rewards?.length) content = "All Rewards have been removed."
            else content = "Specified reward don't exist"

            edit(message, content)
        })
    },
})
