import { Message, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { addBoost } from "../../functions/guildDB/boost"
import { Confirmation } from "../../functions/message/confirmation"
import { followUp } from "../../functions/message/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand({
    name: "add-role",
    async callback(command) {
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
