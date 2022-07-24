import { MessageActionRow, MessageEmbed, MessageSelectOptionData } from "discord.js"
import { client } from "../.."
import { color, modalTime } from "../../config"
import { colors } from "../../functions/canvas/getColors"
import { createButton } from "../../functions/discord/createButton"
import { createSelectMenu } from "../../functions/discord/createSelectMenu"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { interactionReply } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { titleCase } from "../../functions/string/titleCase"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: "choose-color",
    async run(button, command) {
        const options: MessageSelectOptionData[] = []
        for (const [k, v] of Object.entries(colors)) {
            if (options.some((x) => x.value === v)) continue
            options.push({
                label: titleCase(k),
                value: v,
                description: `Hex of this color is ${v}`,
            })
        }

        let components = createSelectMenu("Select a color to set.", "choose-color", false, ...options)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Choose Accent Color")
                .setDescription(`Select a color from the options.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
