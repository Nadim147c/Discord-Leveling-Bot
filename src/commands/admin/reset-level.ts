import { getGuildData } from "../../functions/guildDB/getData"
import { Confirmation } from "../../functions/message/confirmation"
import { followUp } from "../../functions/message/message"
import { LevelDB } from "../../models/levels"
import { Command } from "../../structures/Command"

export default new Command({
    name: "reset-level",
    description: "Reset level of a member.",
    options: [
        {
            type: "USER",
            name: "member",
            description: "Target member to reset.",
            required: true,
        },
    ],
    memberPermissions: ["ADMINISTRATOR"],

    async run(command) {
        const user = command.options.getUser("member")

        //  If mentioned member is a bot then bot will send this message
        if (user?.bot) return followUp(command, `Bot doesn't have any level.`)

        const content = `Are you sure that you want to reset **level** of ${user}? \n\nAll changes will be permanent. That means you can't restore user-level.`
        const confirmation = new Confirmation({
            content,
            input: command,
            method: "followUp",
            user: command.user,
            buttonName: "Just do it!",
            denyButton: true,
            denyButtonName: "Not Sure!",
            successMessage: "Member level data has been deleted.",
        })

        confirmation.start(async () => {
            await LevelDB.findOneAndDelete({ guildId: command.guild.id, userId: user.id })

            const member = await command.guild.members.fetch(user.id)

            const rewards = (await getGuildData(command.guild.id))?.rewards || []
            //  Removing Level up roles from the member
            rewards.forEach(x => {
                if (member.roles.cache.get(x.roleId)) member.roles.remove(x.roleId).catch(console.error)
            })
        })
    },
})
