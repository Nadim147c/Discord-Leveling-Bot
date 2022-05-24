export const numberFormatter = (num: number) => {
    const SI = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ]

    const regex = /\.0+$|(\.[0-9]*[1-9])0+$/ // find (5454.0 = .0)

    let i: number
    for (i = SI.length - 1; i > 0; i--) {
        if (num >= SI[i].value) break
    }

    return (num / SI[i].value).toFixed(1).replace(regex, "$1") + SI[i].symbol
}
