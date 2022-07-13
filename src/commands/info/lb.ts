import { Command } from "../../structures/Command"
import { MessageEmbed, MessageAttachment } from "discord.js"
import Canvas from "canvas"
import { leaderboard } from "../../functions/levels/leaderBoard"
import { color } from "../../config"
import { LevelDataType } from "../../models/levels"
import { getProfileCards } from "../../functions/canvas/getProfileCards"
import { followUp } from "../../functions/discord/message"

export default new Command({
    name: "leaderboard",
    description: "Get the server leaderboard.",
    aliases: ["lb"],
    async execute(command) {
        const leaderboardArray = (await leaderboard(command.guild.id, 10).catch(console.error)) as LevelDataType[]

        if (!leaderboardArray.length)
            return followUp(command, `⚠ Guild Doesn't have any level data. Why not chat a bit more!`)

        const canvasArray = await getProfileCards(leaderboardArray)

        const freeSpace = 10

        const canvas = Canvas.createCanvas(1000, (90 + freeSpace) * canvasArray.length)
        const ctx = canvas.getContext("2d")

        canvasArray.forEach((card, index) =>
            ctx.drawImage(card, 0, (card.height + freeSpace) * index, 1000, card.height)
        )

        const files = [new MessageAttachment(canvas.toBuffer(), "leaderboard.png")]
        const embeds = [new MessageEmbed().setColor(color).setImage("attachment://leaderboard.png")]

        command.followUp({ files, embeds }).catch(console.error)
    },
})
