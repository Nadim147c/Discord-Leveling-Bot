export const timeFormatter = (second: number) => {
    const SI = [
        { value: 1, symbol: "second" },
        { value: 60, symbol: "minute" },
        { value: 60 * 60, symbol: "hour" },
        { value: 60 * 60 * 24, symbol: "day" },
        { value: 60 * 60 * 24 * 7, symbol: "week" },
        { value: 60 * 60 * 24 * 30, symbol: "month" },
        { value: 60 * 60 * 24 * 365, symbol: "year" },
    ]

    let int: number, i: number
    for (i = SI.length - 1; i > 0; i--) {
        int = Math.round(second / SI[i].value)
        if (int >= SI[i].value) break
    }

    return int + " " + SI[i].symbol + (int > 1 ? "s" : "")
}
