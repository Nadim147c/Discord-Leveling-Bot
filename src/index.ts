import { config } from "dotenv"
import { leaderboard } from "./functions/levels/leaderBoard"
import { startServer } from "./server"

config()

import { ExtendedClient } from "./structures/Client"

export const client = new ExtendedClient()

startServer("Server is online")

client.start()

leaderboard("957620528028483584", 100)
