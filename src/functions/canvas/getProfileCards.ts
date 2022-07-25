import { createCanvas, Image, loadImage, registerFont } from "canvas"
import { fillText } from "canvas-emojicdn"
import { client } from "../.."
import { LevelDataType } from "../../models/levels"
import { numberFormatter } from "../string/numberFormatter"

export const getProfileCards = async (levelDataArray: LevelDataType[]) => {
    const canvasArray = []

    for (let i = 0; i < levelDataArray.length; i++) {
        const levelData = levelDataArray[i]

        const user = await client.users.fetch(levelData.userId)

        const canvas = createCanvas(1000, 90)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#333"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const defaultAvatar = "https://cdn.discordapp.com/embed/avatars/0.png"

        const avatar = user?.displayAvatarURL({ dynamic: false, format: "png" }) ?? defaultAvatar

        const loadAvatar = (avatar: Image) => ctx.drawImage(avatar, 0, 0, canvas.height, canvas.height)

        await loadImage(avatar).then(loadAvatar).catch(console.error)

        registerFont("assets/fonts/Arial.ttf", { family: "Arial" })

        ctx.font = 'bold 38px "Arial"'
        ctx.fillStyle = "#eee"
        ctx.textAlign = "left"

        const text = `${i + 1}. ${user?.username ?? "Unknown User"} | Message: ${numberFormatter(
            levelData.messages,
        )}`.replace(/ +/g, " ")

        await fillText(ctx, text, canvas.height + 10, 60, "twitter")
        canvasArray.push(canvas)
    }

    return canvasArray
}
