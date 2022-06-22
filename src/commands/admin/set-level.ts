import { GuildMember, Message } from "discord.js"
import { getGuildData } from "../../functions/guildDB/getData"
import { setLevel } from "../../functions/levels/level"
import { Confirmation } from "../../functions/message/confirmation"
import { edit, followUp } from "../../functions/message/message"
import { Command } from "../../structures/Command"

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
    async callback(command) {
        const member = command.options.getMember("member") as GuildMember
        const { user } = member
        const level = command.options.getInteger("level")

        if (level > 100) return followUp(command, `Set-level is limited to level 100.`)

        if (user.bot) return followUp(command, `Bots are ranked higher then you!`)

        const content = `Are you sure that you want to set **${level}** as the level of ${user}? \n\nAll changes will be permanent. That means you can't restore user-level.`

        const confirmation = new Confirmation({
            content,
            input: command,
            method: "followUp",
            user: command.user,
            buttonName: "Yeah",
            denyButton: true,
            denyButtonName: "No! Please don't!",
        })

        confirmation.start(async button => {
            const { levelData } = await setLevel(user.id, command.guild.id, level)

            edit(button.message as Message, `${user} now in level ${level}`)

            const rewards = (await getGuildData(command.guild.id))?.rewards ?? []

            // To avoid unnecessary permission error logging in the console
            const ignoreError = () => null

            //  removing role
            rewards.forEach(reward => {
                if (reward.level > levelData.level && member.roles.cache.has(reward.roleId))
                    member.roles.remove(reward.roleId).catch(ignoreError)
            })

            //  adding role
            rewards.forEach(reward => {
                if (reward.level <= levelData.level) member.roles.add(reward.roleId).catch(ignoreError)
            })
        })
    },
})
