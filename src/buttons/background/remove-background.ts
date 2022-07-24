import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { Button } from "../../structures/Button"

export default new Button({
    id: "remove-bg",
    async run(button, command) {
        button.deferUpdate()
        const userData = await getOrCreateUserData(command.user.id)

        delete userData.background

        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Remove Background")
                .setDescription(`Background has been removed.`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(button.user))
                .setTimestamp(),
        ]

        const disableServerSettings = button.member.permissions.has("ADMINISTRATOR") ? false : true
        const components = [
            new MessageActionRow().setComponents(
                createButton("Profile Settings", "profile-settings"),
                createButton("Server Settings", "guild-settings", "SECONDARY", disableServerSettings),
            ),
        ]

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
