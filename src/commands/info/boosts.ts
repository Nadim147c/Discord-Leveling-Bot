import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { client } from "../.."

export default new Command({
    name: "boosts",
    description: "Get a list of get list of all the boosts roles.",
    async execute(command) {
        const { boosts } = await getOrCreateGuildData(command.guild.id)

        if (!boosts.length) return followUp(command, `Server doesn't have any boost role.`)

        const roles = boosts
            .sort((a, b) => a.amount - b.amount)
            .map((role) => `<@&${role.roleId}> ⸺ **${role.amount}%**  `)
            .join("\n")

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("XP Booster Roles")
                .setDescription(roles)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(command.user))
                .setTimestamp(),
        ]

        command.followUp({ embeds }).catch(console.error)
    },
})
