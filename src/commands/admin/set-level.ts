import { ButtonInteraction, GuildMember, Message, MessageActionRow, MessageEmbed } from "discord.js"
import { getGuildData } from "../../functions/guildDB/getData"
import { setLevel } from "../../functions/levels/level"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { color, idleTime } from "../../config"
import { client } from "../.."
import { timeOut } from "../../functions/discord/timeout"

export default new Command({
    name: "set-level",
    description: "Set level data of a user.",
    options: [
        {
            type: 6,
            name: "member",
            description: "The target member to set level.",
            required: true,
        },
        {
            type: 4,
            name: "level",
            description: "The target level to set level",
            required: true,
        },
    ],
    memberPermissions: ["ADMINISTRATOR"],
    ephemeral: true,
    async execute(command) {
        const member = command.options.getMember("member") as GuildMember
        const { user } = member
        const level = command.options.getInteger("level")

        if (level > 100) return followUp(command, `Set-level is limited to level 100.`)

        if (user.bot) return followUp(command, `Bots are ranked higher then you!`)

        const content = `Are you sure that you want to set **${level}** as the level of ${user}? \n\nAll changes will be permanent. That means you can't restore user-level.`

        const components = [
            new MessageActionRow().setComponents(
                createButton("Yep!", "allow", "DANGER"),
                createButton("No, Don't do this!", "deny", "PRIMARY"),
            ),
        ]

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Set Level")
                .setDescription(content)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(command.user))
                .setTimestamp(),
        ]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message

        if (!message) return

        const button = (await message
            .awaitMessageComponent({ time: idleTime })
            .catch(console.error)) as ButtonInteraction

        if (!button) return timeOut("TIMEOUT", { interaction: command })

        button.deferUpdate()

        if (button.customId === "deny") return timeOut("DENY", { interaction: command })

        const { levelData } = await setLevel(user.id, command.guild.id, level)

        embeds[0].setDescription(`${user} now in level ${level}`)

        const rewards = (await getGuildData(command.guild.id))?.rewards ?? []

        // To avoid unnecessary permission error logging in the console
        const ignoreError = () => null

        //  removing role
        rewards.forEach((reward) => {
            if (reward.level > levelData.level && member.roles.cache.has(reward.roleId))
                member.roles.remove(reward.roleId).catch(ignoreError)
        })

        //  adding role
        rewards.forEach((reward) => {
            if (reward.level <= levelData.level) member.roles.add(reward.roleId).catch(ignoreError)
        })

        command.editReply({ embeds, components: [] }).catch(console.error)
    },
})
