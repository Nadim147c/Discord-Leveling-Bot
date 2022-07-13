import { Command } from "../../structures/Command"
import { EmbedField, GuildMember, ImageURLOptions, MessageAttachment, MessageEmbed } from "discord.js"
import { followUp } from "../../functions/discord/message"
import { getLevelData } from "../../functions/levels/getData"
import { LevelDataType } from "../../models/levels"
import { getUserData } from "../../functions/userDB/getData"
import { createCanvas, Image, loadImage, registerFont } from "canvas"
import { getXp } from "../../functions/levels/level"
import { fitCover } from "../../functions/canvas/fitImage"
import { numberFormatter } from "../../functions/string/numberFormatter"
import { getContrast } from "../../functions/canvas/getContrast"
import { progressBar } from "../../functions/canvas/progressBar"
import { color, messageXp, xpPerMin } from "../../config"
import { getOrCreateGuildData } from "../../functions/guildDB/getData"
import { timeFormatter } from "../../functions/string/timeFormatter"
import { client } from "../.."

export default new Command({
    name: "level",
    description: "Check level of someone.",
    options: [
        {
            type: "USER",
            name: "member",
            description: "Target member to check level.",
        },
    ],
    aliases: ["rank"],
    async execute(command) {
        let member = (command.options.getMember("member") ?? command.member) as GuildMember
        const { user } = member

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
        const backgroundColor = userData?.color?.background || member.displayHexColor || `#0f1925`
        const strokeColor = getContrast(accentColor) || "#222"

        const canvas = createCanvas(1000, 250)
        const ctx = canvas.getContext("2d")

        let x: number,
            y: number,
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

        const imgURLOptions = { format: "png", dynamic: false, size: 1024 } as ImageURLOptions

        const backgroundImageURL = user.banner ? user.bannerURL(imgURLOptions) : userData?.backgroundImage

        // Banner
        if (backgroundImageURL) await loadImage(userData.backgroundImage).then(drawBackground).catch(console.error)

        // Avatar
        const avatar = member.displayAvatarURL(imgURLOptions)

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

        await progressBar({
            context: ctx,
            maxXp: currentToNextLevelXp,
            currentXp: currentProgressXp,
            x,
            y,
            width: 720,
            height: 50,
            accent: accentColor,
            background: strokeColor,
        })

        ctx.lineWidth = 5
        ctx.fillStyle = accentColor
        ctx.font = 'bold 32px "Rubik"'
        ctx.textAlign = "center"
        ctx.strokeStyle = strokeColor

        // Username
        x = 257
        y = 120

        const name = member.displayName.replace(/(( +)|!)/g, " ").trim()

        ctx.font = 'bold 52px "Rubik"'
        ctx.textAlign = "left"
        ctx.strokeText(name, x, y, l)
        ctx.fillText(name, x, y, l)

        ctx.globalAlpha = 0.8
        ctx.font = 'bold 35px "Rubik"'

        //  Level and rank
        x = 255
        y = 170

        ctx.strokeText(`Level: ${levelData.level || 0}   Rank: ${levelData.rank || 0}`, x, y, l)
        ctx.fillText(`Level: ${levelData.level || 0}   Rank: ${levelData.rank || 0}`, x, y, l)

        // XP count
        x = 960
        y = 170

        ctx.textAlign = "right"

        let text = `${numberFormatter(levelData.xp)} / ${numberFormatter(nextLevelXp)} XP`

        ctx.strokeText(text, x, y, l)
        ctx.fillText(text, x, y, l)

        const files = [new MessageAttachment(canvas.toBuffer(), "rank.png")]

        // Embed
        const guildData = await getOrCreateGuildData(command.guildId)
        const xp = numberFormatter(levelData.xp)
        const boosts =
            guildData.boosts.filter((x) => member.roles.cache.has(x.roleId)).reduce((a, v) => a + v.amount, 0) + "%"

        const roles =
            guildData.rewards
                .filter((x) => member.roles.cache.has(x.roleId))
                .map((x) => `<@&${x.roleId}>`)
                .join(", ") || "none"

        const requiredXp = numberFormatter(nextLevelXp - levelData.xp)
        const requiredMsg = numberFormatter(
            Math.round((nextLevelXp - levelData.xp) / ((messageXp.max + messageXp.min) / 2))
        )
        const requiredVoiceTime = timeFormatter(((nextLevelXp - levelData.xp) / xpPerMin) * 60)

        const fields: EmbedField[] = [
            {
                name: "Achievements:",
                value: `Rank: ${levelData.level}\nRoles: ${roles}`,
                inline: true,
            },
            {
                name: "Activities:",
                value: `Messages: ${numberFormatter(levelData.messages)}\nLast Activity: <t:${
                    levelData.lastUpdate.valueOf() / 1000
                }:R>`,
                inline: true,
            },
            {
                name: "Requirement for next level || Level: 26",
                value: `XP: ${requiredXp}\nAverage Messages: ${requiredMsg}\nAverage Voice Time: ${requiredVoiceTime}`,
                inline: false,
            },
        ]

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL(imgURLOptions) })
                .setTitle(`${member.displayName}'s XP`)
                .setThumbnail(member.displayAvatarURL({ size: 1024 }))
                .setDescription(`XP: ${xp}\nLevel: ${levelData.level}\nXP Boost: ${boosts}`)
                .addFields(...fields)
                .setImage("attachment://rank.png")
                .setTimestamp(),
        ]

        command.followUp({ files, embeds }).catch(console.error)
    },
})
