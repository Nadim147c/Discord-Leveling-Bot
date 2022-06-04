import {
    Channel,
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    MessageSelectMenu,
    MessageSelectOptionData,
    User,
} from "discord.js"
import { color, idle } from "../../config"
import { interactionReply } from "../message/message"
import { setColor } from "./color"

type option = {
    user: User
    method?: "edit" | "reply" | "followUp"
}

type input = Message | Interaction | Channel

export const userSetting = async (input: input, { user, method = "edit" }: option) => {
    const title = "User Configure"

    let files = []

    let options: MessageSelectOptionData[] = [
        {
            label: "Accent",
            value: "accent",
            description: "Change accent color",
        },
        {
            label: "Stroke",
            value: "stroke",
            description: "Change stroke color",
        },
        {
            label: "Background",
            value: "background",
            description: "Change background color",
        },
    ]

    let components = [
        new MessageActionRow().setComponents(
            new MessageSelectMenu()
                .setCustomId("color")
                .setMaxValues(1)
                .setPlaceholder("Color")
                .setOptions(...options)
        ),
        new MessageActionRow().setComponents(
            new MessageButton().setCustomId("background").setLabel("Background").setStyle("SUCCESS")
        ),
    ]

    let embeds = [
        new MessageEmbed().setColor(color).setTitle(title).setDescription("Select the what you want to configure."),
    ]

    const message = (await input[method]({ embeds, components, files }).catch(console.error)) as Message

    if (!message) return

    const componentsCollector = message.createMessageComponentCollector({ idle })

    async function stopCollectors() {
        componentsCollector.stop()
    }

    async function onComponentCollect(interaction: MessageComponentInteraction): Promise<any> {
        // User Check
        if (interaction.user.id !== user.id) {
            componentsCollector.collected.delete(interaction.id)
            return interactionReply(
                interaction,
                `${interaction.user}, I didn't ask you.\n Use \`/help\` for help or list of command.`
            )
        }
        interaction.deferUpdate()

        if (interaction.isSelectMenu() && interaction.customId === "color") {
            stopCollectors()
            return setColor(message, { user, type: interaction.values[0] as any })
        }

        if (interaction.customId === "background") {
            return stopCollectors()
        }
    }

    componentsCollector.on("collect", onComponentCollect)
}
