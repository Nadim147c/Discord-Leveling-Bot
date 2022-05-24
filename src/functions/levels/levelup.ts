import { GuildMember, TextBasedChannel } from "discord.js"
import { client } from "../.."
import { GuildDataType } from "../../models/guild"
import { LevelDataType } from "../../models/levels"
import { send } from "../message/message"
import { replaceVariables } from "../string/replaceVariables"

export const levelUp = async (member: GuildMember, levelData: LevelDataType, guildData: GuildDataType) => {
    if (guildData.levelUpChannel) {
        let message = guildData.levelUpMessage || `${member} reached level **${levelData.level}**`
        message = replaceVariables(message, member, levelData.level)

        const channel = (await client.channels.fetch(guildData.levelUpChannel)) as TextBasedChannel
        send(channel, message)
    }

    const NoError = () => {} //  To avoid unnecessary permission error log

    //  Making sure that level up rewards/roles equal to the new level of the user
    guildData.rewards.forEach(reward => {
        if (reward.level > levelData.level && member.roles.cache.has(reward.roleId))
            member.roles.remove(reward.roleId).catch(NoError)
    })

    //  Adding role to the member
    guildData.rewards.forEach(reward => {
        if (reward.level <= levelData.level) member.roles.add(reward.roleId).catch(NoError)
    })
}
