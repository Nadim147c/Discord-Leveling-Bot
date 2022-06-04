import { createCanvas } from "canvas"
import { error } from "console"
import {
    Channel,
    Interaction,
    Message,
    MessageActionRow,
    MessageAttachment,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    User,
} from "discord.js"
import { color, idle } from "../../config"
import { edit, interactionReply, messageReply } from "../message/message"
import { colorSelector } from "../string/colorSelector"
import { getOrCreateUserData } from "../userDB/getData"
import { goToSetting } from "./home"

type option = {
    user: User
    type: "accent" | "stroke" | "background"
    method?: "edit" | "reply" | "followUp"
}
type input = Message | Interaction | Channel

export const setColor = async (input: input, { user, type, method = "edit" }: option) => {
    const title = `Color Change: ${type}`
    let files = []
    let components = [
        new MessageActionRow().setComponents(
            new MessageButton().setCustomId("home").setLabel("Back to Setting").setStyle("SECONDARY")
        ),
    ]

    let embeds = [
        new MessageEmbed().setColor(color).setTitle(title).setDescription("Type the name of the color or hex code."),
    ]

    const botMessage = (await input[method]({ embeds, components, files }).catch(error)) as Message

    if (!botMessage) return

    const filter = (message: Message) => !message.author.bot && message.author.id === user.id

    const messageCollector = botMessage.channel.createMessageCollector({ idle, filter })
    const componentsCollector = botMessage.createMessageComponentCollector({ idle })

    const userData = await getOrCreateUserData(user.id)

    async function onMessageCollect(message: Message): Promise<any> {
        const colorHex = colorSelector(message.content ?? "")

        if (colorHex === "error")
            return messageReply(message, "Invalid color name or hex code.\nPlease retry or change the color.")

        userData.color[type] = colorHex
        userData.save()

        const canvas = createCanvas(100, 100)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = colorHex

        ctx.fillRect(0, 0, 100, 100)

        messageCollector.stop()

        const files = [new MessageAttachment(canvas.toBuffer(), `color-preview.png`)]

        embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle(title)
                .setDescription(`Color set to: ${colorHex}`)
                .setImage("attachment://color-preview.png"),
        ]

        return botMessage.edit({ embeds, components, files }).catch(error)
    }

    messageCollector.on("collect", onMessageCollect)

    async function onComponentCollect(interaction: MessageComponentInteraction): Promise<any> {
        if (interaction.user.id !== user.id) {
            componentsCollector.collected.delete(interaction.id)
            return interactionReply(
                interaction,
                `${interaction.user}, I didn't ask you.\n Use \`/help\` for help or list of command.`
            )
        }

        interaction.deferUpdate().catch(error)

        messageCollector.stop()
        componentsCollector.stop()

        return goToSetting(botMessage, { user })
    }

    componentsCollector.on("collect", onComponentCollect)
}
