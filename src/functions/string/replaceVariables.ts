import { GuildMember } from "discord.js"

export const replaceVariables = (str: string, member: GuildMember, level: number) => {
    const char = {
        mention: `${member}`,
        nickname: `${member.displayName}`,
        username: `${member.user.username}`,
        tag: `${member.user.tag}`,
        level: `${level}`,
    }
    
    return str.replace(/%(mention|nickname|username|tag|level)%/gi, (word: string) => char[word.replace(/%/g, "")])
}
