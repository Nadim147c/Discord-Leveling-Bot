import { getOrCreateGuildData } from "../functions/guildDB/getData"
import { addXp, getRandomXp } from "../functions/levels/xp"
import { levelUp as levelUpFunction } from "../functions/levels/levelup"
import { Event } from "../structures/Event"
import { client } from ".."

export default new Event("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return

    const previousTime = client.coolDown.get(message.author.id) ?? 0

    const currentTime = new Date().valueOf()

    if (previousTime - currentTime < 60000) {
        client.coolDown.set(message.author.id, currentTime)
        return
    }

    client.coolDown.set(message.author.id, currentTime)

    let xp = getRandomXp()

    const guildData = await getOrCreateGuildData(message.guild.id)

    // Adding boosts if member has those roles
    guildData.boosts.forEach((boost) => {
        if (message.member.roles.cache.has(boost.roleId)) xp += xp * (boost.amount / 100)
    })

    const { levelData, levelUp } = await addXp(message.author.id, message.guild.id, xp)

    if (levelUp) await levelUpFunction(message.member, levelData, guildData)
})
