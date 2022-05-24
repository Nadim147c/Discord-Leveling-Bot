import { getOrCreateGuildData } from "../functions/guildDB/getData"
import { addXp, getRandomXp, removeXp } from "../functions/levels/xp"
import { levelUp as levelUpFunction } from "../functions/levels/levelup"
import { Event } from "../structures/Event"
import { GuildTextBasedChannel, Message } from "discord.js"
import { spamConfig } from "../config"
import { messageReply } from "../functions/message/message"

export default new Event("messageCreate", async message => {
    if (!message.guild || message.author.bot) return

    let xp = getRandomXp()

    const guildData = await getOrCreateGuildData(message.guild.id)

    // Adding boosts if member has those roles
    guildData.boosts.forEach(boost => {
        if (message.member.roles.cache.has(boost.roleId)) xp += xp * (boost.amount / 100)
    })

    const { levelData, levelUp } = await addXp(message.author.id, message.guild.id, xp)

    if (levelUp) await levelUpFunction(message.member, levelData, guildData)

    //  Spam detection system
    const filter = (msg: Message) => msg.author.id === message.author.id
    const collector = message.channel.createMessageCollector({ filter, time: 1000 * spamConfig.time })

    collector.on("end", async messages => {
        let spam: boolean
        if (messages.size >= spamConfig.amount) spam = true

        if (!spam) return

        const channel = message.channel as GuildTextBasedChannel

        if (spamConfig.delete) channel.bulkDelete(messages).catch(_ => null)

        await removeXp(message.author.id, message.guild.id, spamConfig.xp * 1) // XP Removing

        messageReply(message, `You lost ${spamConfig.xp}XP for spamming`, false, 5)
    })
})
