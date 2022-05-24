import { Client, Collection } from "discord.js"
import { readdirSync } from "fs"
import { connect as mongoDBConnect } from "mongoose"
import { bot_token, mongodb_url } from "../config"
import { CommandType } from "../typings/commands"

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection()
    coolDown: Collection<string, Collection<string, number>> = new Collection()
    voiceTime: Collection<string, number> = new Collection()

    constructor() {
        super({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] })
    }

    async start() {
        await this.registerModules()
        mongoDBConnect(mongodb_url)
        this.login(bot_token).then(() => console.log(`${this.user.tag} is ready`))
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }

    async registerModules() {
        const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")
        const handlers = readdirSync(`${__dirname}/../handlers/`).filter(filter)
        handlers.forEach(async (file: string) => (await this.importFile(`${__dirname}/../handlers/${file}`))(this))
    }
}
