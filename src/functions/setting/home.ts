import { error } from "console"
import {
    Channel,
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    User,
} from "discord.js"
import { color, idle } from "../../config"
import { userSetting } from "./user"

type option = {
    user: User
    method?: "edit" | "reply" | "followUp"
}
type input = Message | Interaction | Channel

export const goToSetting = async (input: input, { user, method = "edit" }: option) => {
    const title = "Setting"

    let components = [
        new MessageActionRow().setComponents(
            new MessageButton().setCustomId("user").setLabel("User").setStyle("SUCCESS"),
            new MessageButton().setCustomId("server").setLabel("Server").setStyle("SUCCESS")
        ),
    ]

    let embeds = [
        new MessageEmbed().setColor(color).setTitle(title).setDescription("Select the what you want to configure."),
    ]

    const message = (await input[method]({ embeds, components }).catch(error)) as Message

    if (!message) return

    const componentsCollector = message.createMessageComponentCollector({ idle })

    async function onComponentCollect(interaction: MessageComponentInteraction): Promise<any> {
        // User Check
        if (interaction.user.id !== user.id) {
            componentsCollector.collected.delete(interaction.id)
            return interaction.reply("I didn't asked you.").catch(console.error)
        }

        interaction.deferUpdate().catch(error)

        if (interaction.customId === "user") {
            componentsCollector.stop()
            return userSetting(message, { user })
        }
        if (interaction.customId === "server") return componentsCollector.stop()
    }

    componentsCollector.on("collect", onComponentCollect)
}
