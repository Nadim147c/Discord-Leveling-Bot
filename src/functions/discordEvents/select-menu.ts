import { client } from "../.."
import { ExtendedCommand } from "../../typings/Commands"
import { ExtendedSelect } from "../../typings/SelectMenus"
import { interactionReply } from "../discord/message"
import { titleCase } from "../string/titleCase"

export const selectEvent = (select: ExtendedSelect, command: ExtendedCommand) => {
    if (!select.isSelectMenu()) return
    const module = client.selectMenus.get(select.customId.replace(/[0-9]+/g, ""))

    console.log("select", {
        id: select.customId,
        user: select.user.tag,
        values: select.values,
        time: new Date().toDateString() + " " + new Date().getSeconds(),
    })

    if (!module) return

    const { member } = select

    if (module.memberPermissions?.length) {
        const permissions = module.memberPermissions.filter((x) => !member.permissions.has(x))
        const permissionName = titleCase(permissions.join(", "))
        if (permissions.length)
            return interactionReply(select, `You need ${permissionName} permission(s) to execute this command!`, true)
    }

    try {
        module.run(select, command)
    } catch (error) {
        console.error(error)
    }
}
