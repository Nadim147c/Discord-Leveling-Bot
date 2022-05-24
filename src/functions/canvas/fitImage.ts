import { Canvas, Image } from "canvas"

export const fitCover = (canvas: Canvas, ctx: CanvasRenderingContext2D, image: Image) => {
    const hRatio = canvas.width / image.width
    const vRatio = canvas.height / image.height
    const ratio = Math.max(hRatio, vRatio)
    const centerShift_x = (canvas.width - image.width * ratio) / 2
    const centerShift_y = (canvas.height - image.height * ratio) / 2
    ctx.drawImage(
        image as any,
        0,
        0,
        image.width,
        image.height,
        centerShift_x,
        centerShift_y,
        image.width * ratio,
        image.height * ratio
    )
}
