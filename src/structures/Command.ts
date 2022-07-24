import { CommandType } from "../typings/Commands"

export class Command {
    constructor(commandOptions: CommandType) {
        if (commandOptions.defferReply === undefined) commandOptions.defferReply = true
        Object.assign(this, commandOptions)
    }
}
