import { Canvas, createCanvas } from "canvas"

type option = {
    context: CanvasRenderingContext2D
    maxXp: number
    currentXp: number
    x: number
    y: number
    width: number
    height: number
    accent: string
    background: string
}

export const progressBar = async ({ context, maxXp, currentXp, x, y, width, height, accent, background }: option) => {
    if (currentXp > maxXp) currentXp = maxXp
    if (currentXp < 0) currentXp = 0
    const roundness = 30
    const strokeWidth = 15

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext("2d")

    // Progress track
    ctx.beginPath()
    ctx.moveTo(0 + roundness, 0)
    ctx.bezierCurveTo(0, 0, 0, height, roundness, height)
    ctx.lineTo(width - roundness, height)
    ctx.bezierCurveTo(width, height, width, 0, width - roundness, 0)
    ctx.closePath()

    // To restore later
    ctx.save()
    ctx.clip()

    ctx.lineWidth = strokeWidth
    ctx.fillStyle = background
    ctx.strokeStyle = background
    ctx.fill()
    ctx.stroke()

    let progress = currentXp / maxXp
    if (progress + 0.05 < 1) progress += 0.05

    // the progress
    width *= progress
    ctx.beginPath()
    ctx.moveTo(0 + roundness, 0)
    ctx.bezierCurveTo(0, 0, 0, height, roundness, height)
    ctx.lineTo(width - roundness, height)
    ctx.bezierCurveTo(width, height, width, 0, width - roundness, 0)
    ctx.closePath()

    ctx.fillStyle = accent
    ctx.strokeStyle = background
    ctx.fill()
    ctx.stroke()

    // To avoid color bleeding on the edge
    ctx.restore()
    ctx.strokeStyle = background
    ctx.lineWidth = 1
    ctx.stroke()

    width /= progress

    context.drawImage(canvas as any, x, y, width, height)
}
