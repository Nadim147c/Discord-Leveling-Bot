import { GuildMember, TextBasedChannel } from "discord.js"
import { client } from "../.."
import { GuildDataType } from "../../models/guild"
import { LevelDataType } from "../../models/levels"
import { send } from "../discord/message"
import { replaceVariables } from "../string/replaceVariables"

export const levelUp = async (member: GuildMember, levelData: LevelDataType, guildData: GuildDataType) => {
    if (guildData.levelup?.channelId) {
        let message = guildData.levelup.message
        message = replaceVariables(message, member, levelData)

        const channel = (await client.channels.fetch(guildData.levelup.channelId)) as TextBasedChannel

        if (channel) channel.send(message).catch(console.error)
    }

    const NoError = () => {} //  To avoid unnecessary permission error log

    //  Making sure that level up rewards/roles equal to the new level of the user
    guildData.rewards.forEach((reward) => {
        if (reward.level > levelData.level && member.roles.cache.has(reward.roleId))
            member.roles.remove(reward.roleId).catch(NoError)
    })

    //  Adding role to the member
    guildData.rewards.forEach((reward) => {
        if (reward.level <= levelData.level) member.roles.add(reward.roleId).catch(NoError)
    })
}
