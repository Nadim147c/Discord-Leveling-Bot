import { Message, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { addBoost } from "../../functions/guildDB/boost"
import { Confirmation } from "../../functions/message/confirmation"
import { followUp } from "../../functions/message/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "add-xp-boost",
    description: "Increase a specific amount of XP for a specific role.",
    options: [
        {
            type: "ROLE",
            name: "role",
            description: "Select role that you want to add.",
            required: true,
        },
        {
            type: "INTEGER",
            name: "amount",
            description: "Amount must be between 1-100.",
            required: true,
        },
    ],
    memberPermissions: ["MANAGE_ROLES"],
    async run(command) {
        const role = command.options.getRole("role")
        const amount = command.options.getInteger("amount")

        if (amount > 100 || amount < 1) return followUp(command, `Amount must be between 1-100.`)

        const confirmation = new Confirmation({
            content: `Are you sure you want give ${amount}% more XP to anyone with ${role} role.`,
            input: command,
            method: "followUp",
            user: command.user,
            buttonName: "Okay.",
            denyButton: true,
            denyButtonName: "Never mind!",
        })

        confirmation.start(async interaction => {
            const message = interaction.message as Message
            const { index } = await addBoost(command.guild.id, amount, role.id)
            const embeds = [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Anyone with the role ${role} will get ${amount}% more XP.`)
                    .setFooter({ text: `ID: ${index}` }),
            ]

            message.edit({ embeds, components: [] }).catch(console.error)
        })
    },
})
