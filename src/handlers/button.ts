import { ExtendedClient } from "../structures/Client"
import { readdirSync } from "fs"
import { ButtonType } from "../typings/Buttons"

export default (client: ExtendedClient) => {
    const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")

    const path = `${__dirname}/../buttons/`
    readdirSync(path).forEach(async (dir: string) => {
        const buttonFiles = readdirSync(`${path}/${dir}`).filter(filter)

        for (const file of buttonFiles) {
            const button: ButtonType = await client.importFile(`${path}/${dir}/${file}`)

            if (!button.id) return

            if (Array.isArray(button.id)) {
                button.id.forEach((id) => client.buttons.set(id, button))
                continue
            }

            client.buttons.set(button.id, button)
        }
    })
}
