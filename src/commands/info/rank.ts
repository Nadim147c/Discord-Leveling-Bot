import { Command } from "../../structures/Command"
import { MessageAttachment } from "discord.js"
import { followUp } from "../../functions/message/message"
import { getLevelData } from "../../functions/levels/getData"
import { LevelDataType } from "../../models/levels"
import { getUserData } from "../../functions/userDB/getData"
import { createCanvas, loadImage, registerFont } from "canvas"
import { getXp } from "../../functions/levels/level"
import { fitCover } from "../../functions/canvas/fitImage"
import { titleCase } from "../../functions/string/titleCase"
import { numberFormatter } from "../../functions/string/numberFormatter"

export default new Command({
    name: "rank",
    description: "Check level of someone.",
    options: [
        {
            type: "USER",
            name: "member",
            description: "Target member to check level.",
        },
    ],
    aliases: ["level"],
    async run(command) {
        let user = command.options.getUser("member") || command.user

        const levelData = (await getLevelData(user.id, command.guild.id, true).catch(console.error)) as LevelDataType

        if (!levelData) return followUp(command, `${user} doesn't have any level.`)

        const nextLevelXp = getXp(levelData.level + 1)
        const CurrentLevelXp = getXp(levelData.level)

        // for ProgressBar
        const currentProgressXp = levelData.xp - CurrentLevelXp
        const currentToNextLevelXp = nextLevelXp - CurrentLevelXp

        const userData = await getUserData(user.id)
        const defaultBackgroundColor = "#223"
        const defaultColor = userData?.color || "#eee"

        const canvas = createCanvas(1000, 250)
        const ctx = canvas.getContext("2d")

        registerFont("assets/fonts/ARIAL.TTF", { family: "Arial" })

        //
        ctx.fillStyle = `#0f1925`
        ctx.fillRect(0, 0, 1000, 250)

        // Banner
        if (userData?.banner)
            await loadImage(userData.banner)
                .then(async banner => {
                    fitCover(canvas, ctx, banner)
                    let grd = ctx.createLinearGradient(0, 250, 1000, 0)
                    grd.addColorStop(0, defaultBackgroundColor)
                    grd.addColorStop(1, "#0000")
                    ctx.fillStyle = grd
                    ctx.fillRect(0, 0, 1000, 250)
                })
                .catch(console.error)

        // Avatar
        const avatar = user.displayAvatarURL({ format: "png", dynamic: false, size: 512 })
        await loadImage(avatar)
            .then(avatar => {
                ctx.strokeStyle = defaultColor
                ctx.lineWidth = 10
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(0, 250)
                ctx.lineTo(170, 250)
                ctx.lineTo(250, 0)
                ctx.closePath()
                ctx.stroke()
                ctx.save()
                ctx.clip()
                ctx.drawImage(avatar, -1, 0, 250, 250)
                ctx.restore()
            })
            .catch(console.error)

        // Progress Bar
        let x = 240
        let y = 185

        let w = 45
        let h = 720

        ctx.fillStyle = defaultBackgroundColor
        ctx.strokeStyle = defaultBackgroundColor
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.bezierCurveTo(x - w / 2, y + w / 8, x - w / 2, y + w - w / 8, x, y + w)
        x += h
        ctx.lineTo(x, y + w)
        ctx.bezierCurveTo(x + w / 2, y + w - w / 8, x + w / 2, y + w / 8, x, y)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        x -= h

        h = 720 * (currentProgressXp / currentToNextLevelXp) //  actual progress

        ctx.fillStyle = defaultColor
        ctx.font = 'bold 32px "Arial"'
        ctx.textAlign = "center"
        ctx.lineWidth = 1
        ctx.strokeStyle = "black"
        let text = `${numberFormatter(levelData.xp)}/${numberFormatter(nextLevelXp)} XP`
        ctx.strokeText(text, 600, 217, 700)
        ctx.fillText(text, 600, 217, 700)

        ctx.fillStyle = defaultColor
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.bezierCurveTo(x - w / 2, y + w / 8, x - w / 2, y + w - w / 8, x, y + w)
        x += h
        ctx.lineTo(x, y + w)
        ctx.bezierCurveTo(x + w / 2, y + w - w / 8, x + w / 2, y + w / 8, x, y)
        ctx.closePath()
        ctx.fill()
        ctx.save()
        ctx.clip()
        ctx.fillStyle = defaultBackgroundColor
        ctx.font = 'bold 32px "Arial"'
        ctx.textAlign = "center"
        ctx.lineWidth = 1
        ctx.fillText(text, 600, 217, 700)
        ctx.strokeText(text, 600, 217, 700)
        ctx.restore()

        ctx.font = 'bold 48px "Arial"'
        ctx.fillStyle = defaultColor
        ctx.textAlign = "left"
        ctx.fillText(titleCase(user.tag.replace("!", "")), 255, 165, 700)

        ctx.font = 'bold 35px "Arial"'
        ctx.textAlign = "right"
        ctx.fillText(`Level: ${levelData.level || 0}   Rank: ${levelData.rank || 0}`, 960, 55, 700)

        const files = [new MessageAttachment(canvas.toBuffer(), "Rank.png")]

        command.followUp({ files }).catch(console.error)
    },
})
