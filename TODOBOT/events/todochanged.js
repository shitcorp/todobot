module.exports = async (client, todoobj) => { 

    //if (todoobj.shared) return;
    //if (todoobj.shared !== true) return;
    if (!todoobj.readonlychannel || todoobj.readonlychannel === '') return;
    if (!todoobj.readonlymessage || todoobj.readonlymessage === '') return;
    
    try {

    } catch (e) {
        console.log(e)
        client.logger.log(e)
    }

    const chann = await client.guilds.cache.get(todoobj.guildid).channels.fetch(todoobj.readonlychannel);
    const msg = await chann.messages.fetch(todoobj.readonlymessage);

    await msg.edit(client.todo(todoobj));
    
};