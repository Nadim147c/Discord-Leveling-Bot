import { client } from "../.."
import { ExtendedButton } from "../../typings/Buttons"
import { ExtendedCommand } from "../../typings/Commands"
import { interactionReply } from "../discord/message"
import { titleCase } from "../string/titleCase"

export const buttonEvent = (button: ExtendedButton, command: ExtendedCommand) => {
    if (!button.isButton()) return
    const module = client.buttons.get(button.customId)

    console.log("button", {
        id: button.customId,
        user: button.user.tag,
        time: new Date().toDateString() + " " + new Date().getSeconds(),
    })

    if (!module) return

    const { member } = button

    if (module.memberPermissions?.length) {
        const permissions = module.memberPermissions.filter((x) => !member.permissions.has(x))
        const permissionName = titleCase(permissions.join(", "))
        if (permissions.length)
            return interactionReply(button, `You need ${permissionName} permission(s) to execute this command!`, true)
    }

    try {
        module.run(button, command)
    } catch (error) {
        console.error(error)
    }
}
