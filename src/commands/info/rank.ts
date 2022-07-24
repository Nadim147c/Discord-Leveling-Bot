import { Command } from "../../structures/Command"
import { GuildMember } from "discord.js"
import { followUp } from "../../functions/discord/message"
import { getLevelData } from "../../functions/levels/getData"
import { LevelDataType } from "../../models/levels"
import { getUserData } from "../../functions/userDB/getData"
import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { getCard, getEmbeds } from "../../functions/canvas/rankCard"

export default new Command({
    name: "level",
    description: "Check level of someone.",
    options: [
        {
            type: "USER",
            name: "member",
            description: "Target member to check level.",
        },
    ],
    aliases: ["rank"],
    async execute(command) {
        let member = (command.options.getMember("member") ?? command.member) as GuildMember
        const { user } = member
        const levelData = (await getLevelData(user.id, command.guild.id, true).catch(console.error)) as LevelDataType

        if (!levelData) return followUp(command, `${user} doesn't have any level.`)

        // Embed
        const userData = await getUserData(user.id)
        const guildData = await getOrCreateGuildData(command.guildId)

        const files = await getCard(member, levelData, userData)
        const embeds = await getEmbeds(member, levelData, guildData)

        command.followUp({ files, embeds }).catch(console.error)
    },
})
