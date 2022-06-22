import { Message, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { addReward } from "../../functions/guildDB/reward"
import { Confirmation } from "../../functions/message/confirmation"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand({
    name: "add-role",
    async callback(command) {
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
