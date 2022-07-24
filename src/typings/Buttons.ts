import { ButtonInteraction, GuildMember, PermissionString } from "discord.js"
import { ExtendedCommand } from "./Commands"

export interface ExtendedButton extends ButtonInteraction {
    member: GuildMember
}

export type ButtonFunction = (button: ExtendedButton, command: ExtendedCommand) => any

export type ButtonType = {
    id: string
    memberPermissions?: PermissionString[]
    run: ButtonFunction
}
