export const getContrast = (hex: string) => {
    if (hex.startsWith("#")) hex = hex.substring(1)
    if (hex.length === 3 || hex.length === 4) hex = hex.split("").reduce((a, v) => a + v + v, "")
    if (hex.length === 8) hex = hex.slice(0, 6)

    const rgb = parseInt(hex, 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

    if (luma > 115) return "#222"
    if (luma > 90) return "#000"
    if (luma > 60) return "#fff"
    return "#ddd"
}
