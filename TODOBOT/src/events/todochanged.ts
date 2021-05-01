export default async (client, todoobj) => {
    if (!todoobj.readonlychannel || todoobj.readonlychannel === '') return
    if (!todoobj.readonlymessage || todoobj.readonlymessage === '') return
    try {
        const chann = await client.guilds.cache.get(todoobj.guildid).channels.fetch(todoobj.readonlychannel)
        const msg = await chann.messages.fetch(todoobj.readonlymessage)
        await msg.edit(client.todo(todoobj))
    } catch (e) {
        client.logger.log(e)
    }
}
