import { ButtonInteraction, GuildMember, PermissionString } from "discord.js"
import { ExtendedClient } from "../structures/Client"
import { ExtendedCommand } from "./Commands"

export interface ExtendedButton extends ButtonInteraction {
    member: GuildMember
    client: ExtendedClient
}

export type ButtonFunction = (button: ExtendedButton, command: ExtendedCommand) => any

export type ButtonType = {
    id: string | string[]
    memberPermissions?: PermissionString[]
    run: ButtonFunction
}
