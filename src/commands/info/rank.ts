import { Command } from "../../structures/Command"
import { MessageAttachment } from "discord.js"
import { followUp } from "../../functions/message/message"
import { getLevelData } from "../../functions/levels/getData"
import { LevelDataType } from "../../models/levels"
import { getUserData } from "../../functions/userDB/getData"
import { createCanvas, Image, loadImage, registerFont } from "canvas"
import { getXp } from "../../functions/levels/level"
import { fitCover } from "../../functions/canvas/fitImage"
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
        let user = command.options.getUser("member") ?? command.user

        const levelData = (await getLevelData(user.id, command.guild.id, true).catch(console.error)) as LevelDataType

        if (!levelData) return followUp(command, `${user} doesn't have any level.`)

        const nextLevelXp = getXp(levelData.level + 1)
        const CurrentLevelXp = getXp(levelData.level)

        // for ProgressBar
        const currentProgressXp = levelData.xp - CurrentLevelXp
        const currentToNextLevelXp = nextLevelXp - CurrentLevelXp

        const userData = await getUserData(user.id)

        const accentColor = userData?.color?.accent || "#eee"
        const secondaryColor = "#223"
        const backgroundColor = userData?.color?.background || `#0f1925`
        const strokeColor = userData?.color?.stroke || "#222"

        const canvas = createCanvas(1000, 250)
        const ctx = canvas.getContext("2d")

        let x: number,
            y: number,
            h: number,
            w: number,
            l = 700

        registerFont("assets/fonts/Rubik.ttf", { family: "Rubik" })

        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const drawBackground = (banner: Image) => {
            fitCover(canvas, ctx, banner)
            let grd = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)
            grd.addColorStop(0, secondaryColor)
            grd.addColorStop(1, "#0000")
            ctx.fillStyle = grd
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // Banner
        if (userData?.backgroundImage)
            await loadImage(userData.backgroundImage).then(drawBackground).catch(console.error)

        // Avatar
        const avatar = user.displayAvatarURL({ format: "png", dynamic: false, size: 512 })

        const drawAvatar = (avatar: Image) => {
            ctx.strokeStyle = accentColor
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
        }

        await loadImage(avatar).then(drawAvatar).catch(console.error)

        // Progress Bar
        x = 240
        y = 185
        w = 45
        h = 720

        ctx.fillStyle = strokeColor
        ctx.strokeStyle = strokeColor
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

        ctx.fillStyle = accentColor
        ctx.font = 'bold 32px "Rubik"'
        ctx.textAlign = "center"
        ctx.lineWidth = 1
        ctx.strokeStyle = strokeColor

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.bezierCurveTo(x - w / 2, y + w / 8, x - w / 2, y + w - w / 8, x, y + w)
        x += h
        ctx.lineTo(x, y + w)
        ctx.bezierCurveTo(x + w / 2, y + w - w / 8, x + w / 2, y + w / 8, x, y)
        ctx.closePath()
        ctx.fill()

        ctx.lineWidth = 2

        // Username
        x = 257
        y = 120

        ctx.font = 'bold 52px "Rubik"'
        ctx.textAlign = "left"
        ctx.strokeText(user.tag.replace(/(( +)|!)/g, " ").trim(), x, y, l)
        ctx.fillText(user.tag.replace(/(( +)|!)/g, " ").trim(), x, y, l)

        ctx.globalAlpha = 0.8
        ctx.font = 'bold 35px "Rubik"'

        //  Level and rank
        x = 255
        y = 170

        ctx.textAlign = "left"
        ctx.strokeText(`Level: ${levelData.level || 0}   Rank: ${levelData.rank || 0}`, x, y, l)
        ctx.fillText(`Level: ${levelData.level || 0}   Rank: ${levelData.rank || 0}`, x, y, l)

        // XP count
        x = 960
        y = 170

        ctx.textAlign = "right"

        let text = `${numberFormatter(levelData.xp)} / ${numberFormatter(nextLevelXp)} XP`

        ctx.lineWidth = 2
        ctx.strokeText(text, x, y, l)
        ctx.fillText(text, x, y, l)

        const files = [new MessageAttachment(canvas.toBuffer(), "Rank.png")]

        command.followUp({ files }).catch(console.error)
    },
})
