import { ChatInputApplicationCommandData, CommandInteraction, GuildMember, PermissionString } from "discord.js"

export interface ExtendedCommand extends CommandInteraction {
    member: GuildMember
}

export type CommandFunction = (interaction: ExtendedCommand) => any

export type CommandType = {
    memberPermissions?: PermissionString[]
    aliases?: string[]
    coolDown?: number
    ephemeral?: boolean
    devOnly?: boolean
    execute: CommandFunction
} & ChatInputApplicationCommandData

export type SubCommandType = {
    name: string
    execute: CommandFunction
}

export type categoryInfo = {
    isConfig: true
    name: string
    emoji: string
    commands: string[]
}
