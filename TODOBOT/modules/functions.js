const Config = require('./models/config'),
  Reminder = require('./models/reminder');

module.exports = (client) => ({
  ...client,
  loadCommand: (category, commandName) => {
    try {
      client.logger.log(`[${category.toUpperCase()}] Loading Command: ${commandName}`);
      const props = require(`../commands/${category}/${commandName}`);
      props.init?.call(client);
      props.help.category = category;
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => client.aliases.set(alias, props.help.name));
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  },
  discordLog: (content, message, event) => {
    if (client.config.debug !== 'true') return
    if (event) 
      return client.guilds.get(client.config.debugguild).channels.get(client.config.debugchannel).send(`__**Error:**__ ${event} \n${content} \n> __**Guild:**__ ${message.guild.name}(${message.guild.id}) \n> __**Channel**__ ${message.channel.id} \n> __**Message:**__ ${message.id} \n> __**Command**__ ${message.content} \n> __**Time:**__ ${dateFormat()}`)
    else
      return client.guilds.get(client.config.debugguild).channels.get(client.config.debugchannel).send(`__**Error:**__ ${content} \n> __**Guild:**__ ${message.guild.name}(${message.guild.id}) \n> __**Channel**__ ${message.channel.id} \n> __**Message:**__ ${message.id} \n> __**Command**__ ${message.content} \n> __**Time:**__ ${dateFormat()}`)
  },
  permLevel: (message) => message.client.permLevels.entries().find(([, { check }]) => check(message))[0],
  awaitReply: async (message, question, time = 15000) => {
    await message.channel.send(question)
    return message.channel.createMessageCollector((msg) => msg.author.id === message.author.id, { limit: 1, time });
  },
  invalidateCache: async (id) => {
    client.cache.del(id, (err) => {
      if(err) return client.logger.debug(err);
      Config.findOne({ _id: id }, (err, doc) => {
        if(err) return client.logger.debug(err);
        client.cache.set(id, JSON.stringify(doc))
      })
    })
  },
  reminderJob: async () => {
    for await (const doc of Reminder.find()) {
      if (doc.expires <= new Date()) {
        // mention the user that submitted the reminder
        let output = `${client.users.cache.get(doc.user)}`
        // if theres users to mention, iterate over the users mentions array and mention them as well
        if (doc.mentions.users.length > 0) doc.mentions.users.forEach(user => output += `, ${client.users.cache.get(user)}`)
        // if theres roles to mention, iterate ove the roles mentions array and mention them
        if (doc.mentions.roles.length > 0) doc.mentions.roles.forEach(role => output += `, <@&${role}>`)
        // tryto get the guild where the reminder was created, then the channel, then send the reminder message in that channel
        try {
          client.guilds.cache.get(doc.guild.id).channels.cache.get(doc.guild.channel).send(output, client.reminder(doc))
        // if the message cant be sent, or the guild cant be fetched or theres some other 
        // error, we have to catch the error and delete the reminder(doc) from the database
        } catch(e) {
          client.logger.debug(e.toString())
          Reminder.deleteOne({ _id: doc._id }, (err) => { if (err) client.logger.debug(err) })
        }
        // if the reminderproperty 'loop' is set to false delete the reminder
        doc.loop === false ? Reminder.deleteOne({ _id: doc._id }, (err) => { if (err) client.logger.debug(err) })
          // else update the reminder in the database with the new expires timestamp
          : Reminder.updateOne({ _id: doc.id }, { systime: new Date(), expires: doc.expires - doc.systime }, (err, aff, resp) => { if (err) client.logger.debug(err) })
      };
    };
  },
  clearReactions: async (message, userId) => {
    const userReactions = message.reactions.cache.filter((reaction) => reaction.users.cache.has(userId));
    try {
      userReactions.values().forEach(react => await react.users.remove(userId))
    } catch (error) {
      client.logger.debug('Failed to remove reactions.', error.toString());
    };
  }
});
