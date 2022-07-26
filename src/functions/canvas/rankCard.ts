import { createCanvas, Image, loadImage, registerFont } from "canvas"
import { fillText, strokeText } from "canvas-emojicdn"
import { EmbedField, GuildMember, ImageURLOptions, MessageAttachment, MessageEmbed } from "discord.js"
import { client } from "../.."
import { color, messageXp, xpPerMin } from "../../config"
import { BoostsType, GuildDataType, RewardsType } from "../../models/guild"
import { LevelDataType } from "../../models/levels"
import { UserDataType } from "../../models/user"
import { getAuthor, getFooter } from "../discord/embed"
import { getXp } from "../levels/level"
import { numberFormatter } from "../string/numberFormatter"
import { timeFormatter } from "../string/timeFormatter"
import { fitCover } from "./fitImage"
import { getContrast } from "./getContrast"
import { progressBar } from "./progressBar"

export const getEmbeds = (member: GuildMember, levelData: LevelDataType, guildData: GuildDataType) => {
    const nextLevel = levelData.level + 1
    const nextLevelXp = getXp(nextLevel)

    const xp = numberFormatter(levelData.xp)

    const filter = (reward: RewardsType | BoostsType) => member.roles.cache.has(reward.roleId)

    const boosts = guildData.boosts.filter(filter).reduce((a, v) => a + v.amount, 0) + "%"
    const roles =
        guildData.rewards
            .filter(filter)
            .map((x) => `<@&${x.roleId}>`)
            .join(", ") || "❌"

    const requiredXp = numberFormatter(nextLevelXp - levelData.xp)

    const requiredMsg = numberFormatter(
        Math.round((nextLevelXp - levelData.xp) / ((messageXp.max + messageXp.min) / 2)),
    )
    const requiredVoiceTime = timeFormatter(((nextLevelXp - levelData.xp) / xpPerMin) * 60)

    const fields: EmbedField[] = [
        {
            name: "Achievements:",
            value: `Rank: ${levelData.rank}\nRoles: ${roles}`,
            inline: true,
        },
        {
            name: "Activities:",
            value: `Messages: ${numberFormatter(levelData.messages)}\nLast Activity: <t:${Math.round(
                levelData.lastUpdate.valueOf() / 1000,
            )}:R>`,
            inline: true,
        },
        {
            name: `Requirement for next level || Level: ${levelData.level + 1}`,
            value: `Required XP: ${requiredXp}\nAverage Messages: ${requiredMsg}\nAverage Voice Time: ${requiredVoiceTime}`,
            inline: false,
        },
    ]

    return [
        new MessageEmbed()
            .setColor(color)
            .setTitle(`${member.displayName}'s XP`)
            .setThumbnail(member.displayAvatarURL({ size: 1024 }))
            .setDescription(`XP: ${xp}\nLevel: ${levelData.level}\nXP Boost: ${boosts}`)
            .addFields(...fields)
            .setImage("attachment://rank.png")
            .setAuthor(getAuthor(client.user))
            .setFooter(getFooter(member.user))
            .setTimestamp(),
    ]
}

export const getCard = async (member: GuildMember, levelData: LevelDataType, userData: UserDataType) => {
    const { user } = member
    const nextLevelXp = getXp(levelData.level + 1)
    const CurrentLevelXp = getXp(levelData.level)

    // for ProgressBar
    const currentProgressXp = levelData.xp - CurrentLevelXp
    const currentToNextLevelXp = nextLevelXp - CurrentLevelXp

    const accentColor = userData?.color.accent || member.displayHexColor || "#eee"
    const secondaryColor = "#223"
    const backgroundColor = userData.background.color || member.user.hexAccentColor || `#0f1925`

    const strokeColor = getContrast(accentColor) || "#222"
    const canvas = createCanvas(1000, 250)
    const ctx = canvas.getContext("2d")

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

    // Banner
    const backgroundImageURL = userData?.background?.image ?? (user.banner ? user.bannerURL(imgURLOptions) : null)
    if (backgroundImageURL) await loadImage(userData?.background?.image).then(drawBackground).catch(console.error)

    // Progress Bar
    let x = 240
    let y = 185

    await progressBar({
        context: ctx,
        progress: currentProgressXp / currentToNextLevelXp,
        x,
        y,
        width: 720,
        height: 50,
        accent: accentColor,
        background: strokeColor,
    })

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

    ctx.lineWidth = 5
    ctx.fillStyle = accentColor
    ctx.font = 'bold 32px "Rubik"'
    ctx.textAlign = "center"
    ctx.strokeStyle = strokeColor

    // Username
    x = 257
    y = 120
    const name = member.displayName.replace(/(( +)|!)/g, " ").trim()
    ctx.font = 'bold 48px "Rubik"'
    ctx.textAlign = "left"
    await strokeText(ctx, name, x, y, "twitter")
    await fillText(ctx, name, x, y, "twitter")
    ctx.globalAlpha = 0.8
    ctx.font = 'bold 35px "Rubik"'

    //  Level and rank
    x = 255
    y = 170
    let levelAndRankText = `Level: ${levelData.level || 0}   Rank: ${levelData.rank || 0}`
    ctx.strokeText(levelAndRankText, x, y)
    ctx.fillText(levelAndRankText, x, y)

    // XP count
    x = 960
    y = 170
    ctx.textAlign = "right"
    let xpText = `${numberFormatter(levelData.xp)} / ${numberFormatter(nextLevelXp)} XP`
    ctx.strokeText(xpText, x, y)
    ctx.fillText(xpText, x, y)

    return [new MessageAttachment(canvas.toBuffer(), "rank.png")]
}
