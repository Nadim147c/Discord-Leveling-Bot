import { Message } from "discord.js"
import { removeReward } from "../../functions/guildDB/reward"
import { Confirmation } from "../../functions/message/confirmation"
import { edit } from "../../functions/message/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "remove-reward",
    description: "Remove already add levelup role of the server.",
    options: [
        {
            type: "INTEGER",
            name: "id",
            description: "Id of the reward",
            required: false,
        },
    ],
    memberPermissions: ["MANAGE_ROLES"],
    aliases: ["remove-levelup-role"],
    async run(command) {
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

        confirmation.start(async interaction => {
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
