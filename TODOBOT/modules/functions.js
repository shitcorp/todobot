const { createMessageCollector } = require('discord.js'),
  { configmodel } = require("./models/configmodel"),
  { remindermodel } = require("./models/remindermodel");

module.exports = (client) => {



  client.loadCommand = (category, commandName) => {
    try {
      let name = category.toUpperCase()
      client.logger.log(`[${name}] Loading Command: ${commandName}`);
      const props = require(`../commands/${category}/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      props.help.category = category;
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.discordlog = () => {


    client.discordlog = (content, message, event) => {
      if (client.config.debug !== "true") return
      if (event) {
        return client.guilds.get(client.config.debugguild).channels.get(client.config.debugchannel).send(`__**Error:**__ ${event} \n${content} \n> __**Guild:**__ ${message.guild.name}(${message.guild.id}) \n> __**Channel**__ ${message.channel.id} \n> __**Message:**__ ${message.id} \n> __**Command**__ ${message.content} \n> __**Time:**__ ${dateFormat()}`)
      }

      return client.guilds.get(client.config.debugguild).channels.get(client.config.debugchannel).send(`__**Error:**__ ${content} \n> __**Guild:**__ ${message.guild.name}(${message.guild.id}) \n> __**Channel**__ ${message.channel.id} \n> __**Message:**__ ${message.id} \n> __**Command**__ ${message.content} \n> __**Time:**__ ${dateFormat()}`)

    }



  };




  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };


  client.awaitreply = async (message, question, time = 60000) => {
    message.channel.send(question)
    const filter = m => m.author.id === message.author.id;
    return collector = message.channel.createMessageCollector(filter, { limit: 1, time: 15000 });
  }


  /**
   * 
   * @param {String} _id Guildid
   * 
   * Invalideates the cached object
   * by id and pulls it back from the database
   * 
   */

  client.invalidateCache = async (_id) => {
    client.cache.del(_id, (err) => {
      err ? client.logger.debug(err) :
        configmodel.findOne({ _id }, (err, doc) => {
          err ? client.logger.debug(err) :
            client.cache.set(_id, JSON.stringify(doc))
        })

    })
  };



  /**
   * Client.mapBuilder
   * @param {Object} obj 
   * @returns {Map} map
   * 
   * Takes in an object and returns a map.
   */
  client.mapBuilder = async (obj) => {
    let map = new Map();
    Object.keys(obj).forEach(key => {
      map.set(key, obj[key]);
    });
    return map;
  };






  /**
   * Client.reminderjob
   * 
   * Checks all reminders from the database
   * periodically and reminds the user(s)
   * when expired. If the reminder is a 
   * repeating reminder, the reminder is 
   * not deleted from the database, it will
   * be updated with the new expires timestamp
   */

  client.reminderjob = async () => {
    for await (const doc of remindermodel.find()) {
      if (doc.expires <= new Date()) {
        // mention the user that submitted the reminder
        let output = `${await client.users.cache.get(doc.user)}`
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
          remindermodel.deleteOne({ _id: doc._id }, (err) => { if (err) client.logger.debug(err) })
        }
        // if the reminderproperty "loop" is set to false delete the reminder
        doc.loop === false ? remindermodel.deleteOne({ _id: doc._id }, (err) => { if (err) client.logger.debug(err) })
          // else update the reminder in the database with the new expires timestamp
          : remindermodel.updateOne({ _id: doc.id }, { systime: new Date(), expires: doc.expires - doc.systime }, (err, aff, resp) => { if (err) client.logger.debug(err) })
      };
    };
  };




  client.clearReactions = async (message, userID) => {
    const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(userID));
    try {
      for (const reaction of userReactions.values()) {
        await reaction.users.remove(userID);
      };
    } catch (error) {
      client.logger.debug('Failed to remove reactions.', error.toString());
    };
  };



  process.on("unhandledRejection", err => {
    if (client.config.dev) console.log(err)
  });





};