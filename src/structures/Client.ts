import { Client, Collection } from "discord.js"
import { readdirSync } from "fs"
import mongoose from "mongoose"
import { bot_token, mongodb_url } from "../config"
import { GuildDataType } from "../models/guild"
import { ButtonType } from "../typings/Buttons"
import { categoryInfo, CommandType } from "../typings/Commands"
import { SelectMenuType } from "../typings/SelectMenus"

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection()
    buttons: Collection<string, ButtonType> = new Collection()
    coolDown: Collection<string, number> = new Collection()
    selectMenus: Collection<string, SelectMenuType> = new Collection()
    commandsInfo: Collection<string, categoryInfo> = new Collection()
    timeout: Collection<string, Collection<string, number>> = new Collection()
    voiceTime: Collection<string, number> = new Collection()
    guildData: Collection<string, GuildDataType> = new Collection()

    constructor() {
        super({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] })
    }

    async start() {
        await this.registerModules()
        this.connectToDatabase(mongodb_url)
        this.login(bot_token).then(() => console.log(`Discord bot is online: ${this.user.username}`))
    }

    private async connectToDatabase(url: string) {
        mongoose.connect(url).then((mongo) => console.log(`Connected to MongoDB: ${mongo.modelNames().join(", ")}`))
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
