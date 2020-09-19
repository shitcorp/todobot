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
   * Client.MapBuilder
   * @param {Object} obj 
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




  client.remindercore = async () => {
    for await (const doc of remindermodel.find()) {
      if (doc.expires <= new Date()) {
        client.guilds.cache.get(doc.guild.id).channels.cache.get(doc.guild.channel).send(`
        ${client.users.cache.get(doc.user)},`, client.reminder(doc))
        remindermodel.deleteOne({ _id: doc._id }, (err) => {
          if (err) client.logger.debug(err)
        })
      }
    }
  };


}