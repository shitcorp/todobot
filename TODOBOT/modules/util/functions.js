const
  { configmodel } = require("../models/configmodel"),
  { remindermodel } = require("../models/remindermodel");

module.exports = (client) => {



  client.loadCommand = (category, commandName) => {
    try {
      let name = category.toUpperCase()
      client.logger.log(`[${name}] Loading Command: ${commandName}`);
      const props = require(`../../commands/${category}/${commandName}`);
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


    // DEBUG=false
    // DEBUG_GUILD=709541114633519177
    // DEBUG_CHANNEL=
    // DEBUG_LOG_CHANNEL=
    // DEBUG_URL_APM_SERVER=http://localhost:8200/

    client.discordlog = async ({ error, event, guild, channel, message, command }) => {
      // if (!process.env.DEBUG || !process.env.DEBUG_GUILD || !process.env.DEBUG_CHANNEL) return;
      if (process.env.DEBUG !== "true") return
      console.log('a')
      return client.guilds.cache.get(process.env.DEBUG_GUILD).channels.cache.get(process.env.DEBUG_CHANNEL).send(client.embed(`
          __**Error:**__ [${event ?? 'none given'}] 
          ${error} 
          > __**Guild:**__ 
          ${guild ?? 'none given'} 
          > __**Channel**__ 
          ${channel ?? 'none given'} 
          > __**Message:**__ 
          ${message ?? 'none given'} 
          > __**Command**__ 
          ${command ?? 'none given'} 
          > __**Time:**__ 
          ${Date.now().toLocaleString()}`
          ))
    }
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
      err ? console.error(err) :
        configmodel.findOne({ _id }, (err, doc) => {
          err ? console.error(err) :
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



  global.mapBuilder = async (obj) => {
    let map = new Map();
    Object.keys(obj).forEach(key => {
      map.set(key, obj[key]);
    });
    return map;
  };


  global.findCommonElements = (arr1, arr2) => {
    return arr1.some(item => arr2.includes(item))
  }




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
        let output = `${await client.users.fetch(doc.user)}`
        // if theres users to mention, iterate over the users mentions array and mention them as well
        if (doc.mentions.users.length > 0) doc.mentions.users.forEach(user => output += `, ${client.users.fetch(user)}`)
        // if theres roles to mention, iterate ove the roles mentions array and mention them
        if (doc.mentions.roles.length > 0) doc.mentions.roles.forEach(role => output += `, <@&${role}>`)
        // tryto get the guild where the reminder was created, then the channel, then send the reminder message in that channel
        try {
          let chann = await client.guilds.cache.get(doc.guild.id).channels.fetch(doc.guild.channel)
          try { 
            await chann.send(output, client.reminder(doc)) 
          } catch (e) {
            // sending to channel went wrong, we should try to dm the user
            try {
              let submittingUser = await client.users.fetch(doc.user);
              let dmchannel = await submittingUser.createDM(true);
              await dmchannel.send(output, client.reminder(doc))
            } catch (e) {
              client.logger.debug(e)
              remindermodel.deleteOne({ _id: doc._id }, (err) => { if (err) client.logger.debug(err) })
            }
          }
          // if the message cant be sent, or the guild cant be fetched or theres some other 
          // error, we have to catch the error and delete the reminder(doc) from the database
        } catch (e) {
          client.logger.debug(e)
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
      console.error(error)
      client.logger.debug('Failed to remove reactions.', error.toString());
    };
  };



  process.on("unhandledRejection", (err, promise) => {
    client.logger.debug(err)
    client.logger.debug(promise)
    //client.apm.captureError(err)
    //client.apm.captureError(promise)
    client.discordlog({ error: err, content: 'Promise: ' + promise })
  });

  process.on("uncaughtException", (err) => {
    client.logger.debug(err)
    client.discordlog({ error: err })
    // client.apm.captureError(err)
  });





};