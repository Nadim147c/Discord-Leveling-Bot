import { client } from "../.."
import { Command } from "../../structures/Command"

export default new Command({
    name: "reward",
    description: "Manage rewards of your server.",
    options: [
        {
            type: "SUB_COMMAND",
            name: "add-role",
            description: "The specified role will be given when the member reaches the specified level.",
            options: [
                {
                    type: "ROLE",
                    name: "role",
                    description: "Select role that you want to add.",
                    required: true,
                },
                {
                    type: "INTEGER",
                    name: "level",
                    description: "Select a target level.",
                    required: true,
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove-role",
            description: "Remove already added XP booster role of the server.",
            options: [
                {
                    type: "INTEGER",
                    name: "id",
                    description: "Id of the boost",
                    required: false,
                },
            ],
        },
    ],
    memberPermissions: ["MANAGE_ROLES"],
    async execute(command) {
        client.runSubCommand("reward", command)
    },
})
