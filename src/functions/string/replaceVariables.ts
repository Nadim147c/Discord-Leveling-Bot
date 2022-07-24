import { GuildMember } from "discord.js"
import { LevelDataType } from "../../models/levels"

export const replaceVariables = (str: string, member: GuildMember, levelData: LevelDataType) => {
    const char = {
        mention: `${member}`,
        nickname: `${member.displayName}`,
        username: `${member.user.username}`,
        user_tag: `${member.user.tag}`,
        user_level: `${levelData.level}`,
        user_xp: `${levelData.xp}`,
    }

    return str.replace(
        /(MENTION|NICKNAME|USERNAME|USER_TAG|USER_LEVEL|USER_XP)/g,
        (word: string) => char[word.toLowerCase()],
    )
}
