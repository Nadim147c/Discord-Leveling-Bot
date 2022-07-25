import { VoiceState } from "discord.js"
import { client } from ".."
import { xpPerMin } from "../config"
import { getOrCreateGuildData } from "../functions/guildDB/getData"
import { levelUp } from "../functions/levels/levelup"
import { addXp } from "../functions/levels/xp"
import { getOrCreateUserData } from "../functions/userDB/getData"
import { Event } from "../structures/Event"

export default new Event("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.member.user.bot) return

    const userId = oldState.member.user.id ?? newState.member.user.id

    const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

    if (!oldState.channelId && newState.channelId) await sleep(2000)

    let time = client.voiceTime.get(userId)

    if (!time) {
        if (!newState.channelId) return
        time = new Date().getTime().valueOf()
        client.voiceTime.set(userId, time)
        return
    }
    const guildId = oldState.guild.id

    const currentTime = new Date().getTime().valueOf()

    let xp = ((currentTime - time) / 60000) * xpPerMin

    !newState.channelId || (newState.deaf && newState.mute)
        ? client.voiceTime.delete(userId)
        : client.voiceTime.set(userId, currentTime)

    if (oldState.mute) xp /= 2

    const guildData = await getOrCreateGuildData(oldState.guild.id)

    // Adding boosts if member has those roles
    guildData.boosts.forEach((boost) => {
        if (oldState.member.roles.cache.has(boost.roleId)) xp += xp * (boost.amount / 100)
    })

    xp = Math.round(xp)

    const { levelData, levelUp: leveledUp } = await addXp(userId, guildId, xp, "VOICE")

    const userData = await getOrCreateUserData(userId)

    if (leveledUp) return levelUp(oldState.member, levelData, guildData, userData)
})
