import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { followUp } from "../../functions/message/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "set-levelup-channel",
    description: "Set a channel where you want to send message when members level up.",
    options: [
        {
            type: "CHANNEL",
            name: "channel",
            description: "Channel must be a text channel.",
            required: true,
        },
    ],
    // ownerOnly: true,
    memberPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],

    async run(command) {
        const channel = command.options.getChannel("channel")

        if (!["GUILD_TEXT", "GUILD_NEWS"].includes(channel.type as string))
            return followUp(command, `${channel} must be a text channel.`)

        let guildData = await getOrCreateGuildData(command.guild.id)

        guildData.levelUpChannel = channel.id
        guildData.save()

        followUp(command, `I'll send levelup message in ${channel}`)
    },
})
