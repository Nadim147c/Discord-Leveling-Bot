import { SubCommandType } from "../typings/commands"

export class SubCommand {
    constructor(commandOptions: SubCommandType) {
        Object.assign(this, commandOptions)
    }
}
