import { MessageActionRow, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color } from "../../config"
import { createButton } from "../../functions/discord/createButton"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { getOrCreateUserData } from "../../functions/userDB/getData"
import { SelectMenu } from "../../structures/SelectMenu"

export default new SelectMenu({
    id: "choose-bg-color",
    async run(select, command) {
        const colorHex = select.values[0]

        select.deferUpdate()

        const userData = await getOrCreateUserData(select.user.id)

        userData.background.color = colorHex

        userData.save()

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Choose Background Color")
                .setDescription(`Color has be set to:`)
                .setImage(`https://via.placeholder.com/200/${colorHex.slice(1)}/${colorHex.slice(1)}.png`)
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(select.user))
                .setTimestamp(),
        ]

        const disableServerSettings = select.member.permissions.has("ADMINISTRATOR") ? false : true
        const components = [
            new MessageActionRow().setComponents(
                createButton("Profile Settings", "profile-settings"),
                createButton("Server Settings", "guild-settings", "SECONDARY", disableServerSettings),
            ),
        ]

        await command.editReply({ embeds, components }).catch(console.error)
    },
})
