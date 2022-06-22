import { ChatInputApplicationCommandData, CommandInteraction, GuildMember, PermissionString } from "discord.js"

export interface ExtendedCommand extends CommandInteraction {
    member: GuildMember
}

export type CommandFunction = (interaction: ExtendedCommand) => any

export type CommandType = {
    memberPermissions?: PermissionString[]
    aliases?: string[]
    coolDown?: number
    category?: string
    ephemeral?: boolean
    devOnly?: boolean
    callback: CommandFunction
} & ChatInputApplicationCommandData

export type SubCommandType = {
    name: string
    callback: CommandFunction
}
