import { createCanvas } from "canvas"
import { config } from "dotenv"
import { writeFileSync } from "fs"
import { progressBar } from "./functions/canvas/progressBar"
import { startServer } from "./server"

config()

import { ExtendedClient } from "./structures/Client"

export const client = new ExtendedClient()

startServer("Server is online")

client.start()
