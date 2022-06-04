import { goToSetting } from "../../functions/setting/home"
import { Command } from "../../structures/Command"

export default new Command({
    name: "setting",
    description: "deploy setting function",
    async run(command) {
        goToSetting(command, { user: command.user, method: "followUp" })
    },
})
