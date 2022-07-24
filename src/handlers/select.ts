import { ExtendedClient } from "../structures/Client"
import { readdirSync } from "fs"
import { SelectMenuType } from "../typings/SelectMenus"

export default (client: ExtendedClient) => {
    const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")

    const path = `${__dirname}/../selectMenus/`
    readdirSync(path).forEach(async (dir: string) => {
        const buttonFiles = readdirSync(`${path}/${dir}`).filter(filter)

        for (const file of buttonFiles) {
            const select: SelectMenuType = await client.importFile(`${path}/${dir}/${file}`)
            if (!select.id) return

            client.selectMenus.set(select.id, select)
        }
    })
}
