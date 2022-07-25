import { Command } from "../../structures/Command"
import { MessageEmbed, MessageAttachment } from "discord.js"
import Canvas from "canvas"
import { leaderboard } from "../../functions/levels/leaderBoard"
import { color, emojis } from "../../config"
import { LevelDataType } from "../../models/levels"
import { getProfileCards } from "../../functions/canvas/getProfileCards"
import { followUp } from "../../functions/discord/message"
import { getAuthor, getFooter } from "../../functions/discord/embed"
import { client } from "../.."

export default new Command({
    name: "leaderboard",
    description: "Get the server leaderboard.",
    aliases: ["lb"],
    async execute(command) {
        const lb = (await leaderboard(command.guild.id, 10).catch(console.error)) as LevelDataType[]

        if (!lb.length) {
            followUp(command, `${emojis.general.warning} Guild Doesn't have any level data. Why not chat a bit more!`)
            return
        }
        const canvasArray = await getProfileCards(lb)

        const freeSpace = 10

        const canvas = Canvas.createCanvas(1000, (90 + freeSpace) * canvasArray.length)
        const ctx = canvas.getContext("2d")

        canvasArray.forEach((card, i) => ctx.drawImage(card, 0, (card.height + freeSpace) * i, 1000, card.height))

        const files = [new MessageAttachment(canvas.toBuffer(), "leaderboard.png")]

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setTitle("Server Leaderboard")
                .setImage("attachment://leaderboard.png")
                .setAuthor(getAuthor(client.user))
                .setFooter(getFooter(command.user))
                .setTimestamp(),
        ]

        command.followUp({ files, embeds }).catch(console.error)
    },
})
