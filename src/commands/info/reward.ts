import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "rewards",
    description: "Get a list of roles will be given when you levelup.",
    aliases: ["levelup-roles"],
    async execute(command) {
        const { rewards } = await getOrCreateGuildData(command.guild.id)

        if (!rewards.length) return followUp(command, `Server doesn't have any rewards.`)

        const roles = rewards
            .sort((a, b) => a.level - b.level)
            .map((role) => `Level **${role.level}** ⸺ <@&${role.roleId}>`)
            .join("\n")

        const embeds = [new MessageEmbed().setTitle("Level Up Rewards:").setDescription(roles).setColor(color)]

        command.followUp({ embeds }).catch(console.error)
    },
})
