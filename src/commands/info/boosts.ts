import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { followUp } from "../../functions/message/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "boosts",
    description: "Get a list of get list of all the boosts roles.",
    async run(command) {
        const { boosts } = await getOrCreateGuildData(command.guild.id)

        if (!boosts.length) return followUp(command, `Server doesn't have any rewards.`)

        const roles = boosts
            .sort((a, b) => a.amount - b.amount)
            .map(role => `<@&${role.roleId}> ⸺ **${role.amount}%**  `)
            .join("\n")

        const embeds = [new MessageEmbed().setTitle("XP boosts roles.").setDescription(roles).setColor(color)]

        command.followUp({ embeds }).catch(console.error)
    },
})
