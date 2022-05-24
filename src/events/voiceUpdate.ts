import { client } from ".."
import { xpPerSecond } from "../config"
import { Event } from "../structures/Event"

// For voice leveling.
// unfinished and coming soon (i guess).

export default new Event("voiceStateUpdate", async (_, newState) => {
    let time = client.voiceTime.get(newState.member.user.id)

    if (!time) {
        if (!newState.channelId) return
        time = new Date().getTime().valueOf()
        client.voiceTime.set(newState.member.user.id, time)
        return
    }

    const currentTime = new Date().getTime().valueOf()

    const xp = ((currentTime - time) / 1000) * xpPerSecond

    console.log({ time, currentTime, xp })
})
