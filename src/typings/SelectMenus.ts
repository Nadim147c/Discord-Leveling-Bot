import { GuildMember, PermissionString, SelectMenuInteraction } from "discord.js"
import { ExtendedCommand } from "./Commands"

export interface ExtendedSelect extends SelectMenuInteraction {
    member: GuildMember
}

export type SelectFunction = (select: ExtendedSelect, command: ExtendedCommand) => any

export type SelectMenuType = {
    id: string
    memberPermissions?: PermissionString[]
    run: SelectFunction
}
