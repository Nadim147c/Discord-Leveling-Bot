import { Message, MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color, emojis, idleTime } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { timeOut } from "../../functions/discord/timeout"
import { buttonEvent } from "../../functions/discordEvents/buttons"
import { selectEvent } from "../../functions/discordEvents/select-menu"
import { Command } from "../../structures/Command"
import { ExtendedButton } from "../../typings/Buttons"
import { ExtendedSelect } from "../../typings/SelectMenus"

export default new Command({
    name: "settings",
    description: "Change setting of profile or server.",
    ephemeral: true,
    async execute(command) {
        const disableServerSettings = command.member.permissions.has("ADMINISTRATOR") ? false : true
        const components = [
            new MessageActionRow().setComponents(
                createButton("Profile Settings", "profile-settings"),
                createButton("Server Settings", "guild-settings", "SECONDARY", disableServerSettings),
            ),
        ]

        let description = `Manage your profile or server settings from here.`

        if (disableServerSettings)
            description += `\n${emojis.general.warning} You Administrator permission to change server settings!`

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Settings")
                .setDescription(description)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(command.user))
                .setTimestamp(),
        ]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message

        const collector = message.createMessageComponentCollector({ idle: idleTime })

        collector.on("collect", async (interaction) => {
            await buttonEvent(interaction as ExtendedButton, command)
            await selectEvent(interaction as ExtendedSelect, command)
        })

        collector.on("end", async (collection): Promise<any> => {
            if (!collection.size) return timeOut("NOREPLY", { interaction: command })
            await timeOut("TIMEOUT", { interaction: command })
        })
    },
})
