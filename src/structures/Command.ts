import { CommandType } from "../typings/commands"

export class Command {
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions)
    }
}
