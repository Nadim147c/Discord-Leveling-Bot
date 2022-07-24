import { config } from "dotenv"
import { writeFileSync } from "fs"
import { startServer } from "./server"

config()

import { ExtendedClient } from "./structures/Client"

export const client = new ExtendedClient()

startServer("Server is online")

client.start()
