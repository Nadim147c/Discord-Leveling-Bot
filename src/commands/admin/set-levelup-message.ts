import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { followUp } from "../../functions/discord/message"
import { replaceVariables } from "../../functions/string/replaceVariables"
import { Command } from "../../structures/Command"
import { saveGuildData } from "../../functions/guildDB/savaData"

export default new Command({
    name: "levelup-message",
    description: "Set a message and channel when a member level up.",
    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
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
        },
    ],
    memberPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],

    async execute(command) {
        const channel = command.options.getChannel("channel")

        let message = command.options.getString("message")

        const guildData = await getOrCreateGuildData(command.guild.id)

        guildData.levelUpChannel = channel.id
        guildData.levelUpMessage = message
        await saveGuildData(guildData)

        message = replaceVariables(message, command.member, Math.round(Math.random() * 100))

        followUp(
            command,
            `I will send this message to ${channel} channel when someone reach new level.\nTest: ${message}`
        )
    },
})
