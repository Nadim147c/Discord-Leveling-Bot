import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { followUp } from "../../functions/message/message"
import { replaceVariables } from "../../functions/string/replaceVariables"
import { Command } from "../../structures/Command"

export default new Command({
    name: "set-levelup-message",
    description: "Set a message and channel when a member level up.",
    options: [
        {
            type: "STRING",
            name: "message",
            description: "Use %mention%, %nickname%, %username%, %tag%, %level% to set variables.",
            required: true,
        },
        {
            type: "CHANNEL",
            name: "channel",
            channelTypes: ["GUILD_NEWS", "GUILD_TEXT"],
            description: "Channel must be a text channel.",
            required: true,
        },
    ],
    memberPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],

    async callback(command) {
        const channel = command.options.getChannel("channel")

        let message = command.options.getString("message")

        const guildData = await getOrCreateGuildData(command.guild.id)

        guildData.levelUpChannel = channel.id
        guildData.levelUpMessage = message
        guildData.save()

        message = replaceVariables(message, command.member, Math.round(Math.random() * 100))

        followUp(
            command,
            `I will select send this message to ${channel} channel when someone reach new level.\nTest: ${message}`
        )
    },
})
