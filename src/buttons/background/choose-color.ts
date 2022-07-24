import { MessageEmbed, MessageSelectOptionData } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { colors } from "../../functions/canvas/getColors"
import { createSelectMenu } from "../../functions/discord/createSelectMenu"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { titleCase } from "../../functions/string/titleCase"
import { Button } from "../../structures/Button"

export default new Button({
    id: "choose-bg-color",
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

        let components = createSelectMenu("Select a color to set.", "choose-bg-color", false, ...options)

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Choose Background Color")
                .setDescription(`Select a color from the options.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        button.deferUpdate()

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
