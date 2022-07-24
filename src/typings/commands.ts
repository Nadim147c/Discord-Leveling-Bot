import {
    ApplicationCommandSubCommandData,
    ChatInputApplicationCommandData,
    CommandInteraction,
    GuildMember,
    PermissionString,
} from "discord.js"

export interface ExtendedCommand extends CommandInteraction {
    member: GuildMember
}

export type CommandFunction = (interaction: ExtendedCommand) => any

export type CommandType = {
    memberPermissions?: PermissionString[]
    defferReply?: boolean
    aliases?: string[]
    timeout?: number
    ephemeral?: boolean
    devOnly?: boolean
    execute: CommandFunction
} & ChatInputApplicationCommandData

export type categoryInfo = {
    isConfig: true
    name: string
    emoji: string
    commands: string[]
}
