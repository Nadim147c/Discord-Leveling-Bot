import { createCanvas, Image, loadImage, registerFont } from "canvas"
import { client } from "../.."
import { LevelDataType } from "../../models/levels"
import { numberFormatter } from "../string/numberFormatter"
import { titleCase } from "../string/titleCase"

export const getProfileCards = async (levelDataArray: LevelDataType[]) => {
    const canvasArray = []

    for (let i = 0; i < levelDataArray.length; i++) {
        const levelData = levelDataArray[i]

        const user = await client.users.fetch(levelData.userId)

        const freeSpace = 10

        const canvas = createCanvas(800, 100)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#303443"
        ctx.fillRect(0, 0, canvas.width, canvas.height - freeSpace)

        const avatar =
            user?.displayAvatarURL({ dynamic: false, format: "png" }) ||
            "https://cdn.discordapp.com/embed/avatars/0.png"

        const loadAvatar = (avatar: Image) =>
            ctx.drawImage(avatar, 0, 0, canvas.height - freeSpace, canvas.height - freeSpace)

        await loadImage(avatar).then(loadAvatar).catch(console.error)

        registerFont("assets/fonts/ARIAL.TTF", { family: "Arial" })

        ctx.font = 'bold 38px "Arial"'
        ctx.fillStyle = "#eee"
        ctx.textAlign = "left"
        ctx.fillText(
            `${i + 1}. ${titleCase(user?.tag || "Unknown User#0000")} || Msg: ${numberFormatter(levelData.messages)}`,
            canvas.height,
            60,
            700
        )
        canvasArray.push(canvas)
    }

    return canvasArray
}
