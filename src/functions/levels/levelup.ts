import { GuildMember, TextBasedChannel } from "discord.js"
import { client } from "../.."
import { GuildDataType } from "../../models/guild"
import { LevelDataType } from "../../models/levels"
import { UserDataType } from "../../models/user"
import { replaceVariables } from "../string/replaceVariables"

export const levelUp = async (
    member: GuildMember,
    levelData: LevelDataType,
    guildData: GuildDataType,
    userData: UserDataType,
) => {
    if (guildData.levelup?.channelId) {
        let content = guildData.levelup.message
        content = replaceVariables(content, member, levelData)

        const channel = (await client.channels.fetch(guildData.levelup.channelId)) as TextBasedChannel

        const users = userData.levelup_mention ? [userData.id] : []

        if (channel) channel.send({ content, allowedMentions: { users } }).catch(console.error)
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
