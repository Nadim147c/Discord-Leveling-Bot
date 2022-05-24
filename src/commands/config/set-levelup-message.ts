import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { followUp } from "../../functions/message/message"
import { replaceVariables } from "../../functions/string/replaceVariables"
import { Command } from "../../structures/Command"

export default new Command({
    name: "set-levelup-message",
    description: "Set a channel where you want to send message when members level up.",
    options: [
        {
            type: "STRING",
            name: "message",
            description: "Use %mention%, %nickname%, %username%, %tag%, %level% to set variables.",
            required: true,
        },
    ],
    memberPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],

    async run(command) {
        let message = command.options.getString("message")

        let guildData = await getOrCreateGuildData(command.guild.id)

        guildData.levelUpMessage = message
        guildData.save()

        const { member } = command

        message = replaceVariables(message, member, Math.round(Math.random() * 100))

        followUp(command, `I will select send this message when someone reach new level.\nTest: ${message}`)
    },
})
