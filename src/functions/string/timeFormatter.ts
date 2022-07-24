export const timeFormatter = (second: number) => {
    const SI = [
        { value: 60 * 60 * 24 * 365, symbol: "year" },
        { value: 60 * 60 * 24 * 30, symbol: "month" },
        { value: 60 * 60 * 24, symbol: "day" },
        { value: 60 * 60, symbol: "hour" },
        { value: 60, symbol: "minute" },
        { value: 1, symbol: "second" },
    ]

    let int: number, i: number
    for (i = 0; i < SI.length; i++) {
        int = Math.floor(second / SI[i].value)
        if (int >= 1) break
    }

    return int + " " + SI[i].symbol + (int > 1 ? "s" : "")
}
