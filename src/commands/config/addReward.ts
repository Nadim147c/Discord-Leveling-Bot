import { Message, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { addReward } from "../../functions/guildDB/reward"
import { Confirmation } from "../../functions/message/confirmation"
import { Command } from "../../structures/Command"

export default new Command({
    name: "add-reward",
    description: "The specified role will be given when the member reaches the specified level.",
    options: [
        {
            type: "ROLE",
            name: "role",
            description: "Select role that you want to add.",
            required: true,
        },
        {
            type: "INTEGER",
            name: "level",
            description: "Select a target level.",
            required: true,
        },
    ],
    memberPermissions: ["MANAGE_ROLES"],
    aliases: ["add-levelup-role"],
    async run(command) {
        const role = command.options.getRole("role")
        const level = command.options.getInteger("level")

        const confirmation = new Confirmation({
            content: `Are you sure you want add ${role} on level ${level}`,
            input: command,
            method: "followUp",
            user: command.user,
            buttonName: "Yep!",
            denyButton: true,
            denyButtonName: "Nope",
        })

        confirmation.start(async interaction => {
            const message = interaction.message as Message
            const { index } = await addReward(command.guild.id, level, role.id)
            const embeds = [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(
                        `I will add ${role} when member reach level ${level}\nYou can use this id to remove this reward.`
                    )
                    .setFooter({ text: `ID: ${index}` }),
            ]

            message.edit({ embeds, components: [] }).catch(console.error)
        })
    },
})
