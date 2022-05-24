// Optional...
import express from "express"
const server = express()
server.all("/", (_: any, res: any) => {
    res.setHeader("Content-Type", "text/html")
    res.write("<h1>Hosting is active</h1>")
    res.end()
})
export const startServer = (log: string) => server.listen(3000, () => console.log(log))
