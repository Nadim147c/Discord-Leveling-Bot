import { client } from "../.."
import { Command } from "../../structures/Command"

export default new Command({
    name: "xp-boost",
    description: "Manage xp boosts for the server",
    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "Increase a specific amount of XP for a specific role.",
            options: [
                {
                    type: "ROLE",
                    name: "role",
                    description: "Select role that you want to add.",
                    required: true,
                },
                {
                    type: "INTEGER",
                    name: "amount",
                    description: "Amount must be between 1-100.",
                    required: true,
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
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
        client.runSubCommand("boosts", command)
    },
})
