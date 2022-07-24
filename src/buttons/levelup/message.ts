import { MessageActionRow, MessageEmbed, MessageSelectOptionData, Role } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createSelectMenu } from "../../functions/discord/createSelectMenu"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { getSelectOptionsFormChannel } from "../../functions/discord/getSelectOptions"
import { Button } from "../../structures/Button"

export default new Button({
    id: "set-levelup-msg",
    memberPermissions: ["ADMINISTRATOR"],
    async run(button, command) {
        let channels = button.guild.channels.cache.filter(
            (channel) => channel.type === "GUILD_TEXT" || channel.type === "GUILD_NEWS",
        )

        const options: MessageSelectOptionData[] = channels.map(getSelectOptionsFormChannel)

        const components = createSelectMenu(
            "Where you want send the levelup message?",
            "set-levelup-msg",
            false,
            ...options,
        )

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Set Levelup Message")
                .setDescription(`Select channel and message for levelup message.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
