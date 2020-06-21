const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const chalk = require("chalk")


const client = new Discord.Client();
const Constants = require('discord.js/src/util/Constants.js')
Constants.DefaultOptions.ws.properties.$browser = `Discord iOS`

client.config = require("./config.js");

client.logger = require("./modules/Logger");

require("./modules/dbhandler.js")(client);
require("./modules/functions.js")(client);
require("./modules/embeds.js")(client);


client.commands = new Enmap();
client.aliases = new Enmap();


const init = async () => {
  
    async function load(category) {
      let name = category.toUpperCase()
      const cmdFilesFun = await readdir(`./commands/${category}/`);
      let amount = cmdFilesFun.length
      client.logger.log(`${chalk.bgBlue("[CATGEORY]")} [${name}] [COMMANDS: ${chalk.green(amount)}]`);
      cmdFilesFun.forEach(f => {
        if (!f.endsWith(".js")) return;
        const response = client.loadCommand(category, f);
        if (response) console.log(response);
      });
    }
  
    
  
    var categorys = [
      'system'
    ]
  
    categorys.forEach(c => {
      load(c);
    
    })
  
  
  
  
    const evtFiles = await readdir("./events/");
    let amount = evtFiles.length
    client.logger.log(`${chalk.bgBlue("[EVENTS]")} Loading ${chalk.green(amount)} events.`);
    evtFiles.forEach(file => {
      const eventName = file.split(".")[0];
      client.logger.log(`[EVENT] Loading Event: ${eventName}`);
      const event = require(`./events/${file}`);
  
      client.on(eventName, event.bind(null, client));
    });
  
    
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }
  
  
  
  
    client.on('raw', packet => {
      // We don't want this to run on unrelated packets
      if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE', 'VOICE_STATE_UPDATE'].includes(packet.t)) return;
      // Grab the channel to check the message from
      if (packet.t === 'VOICE_STATE_UPDATE') {
  
        let user = packet.d.user_id
        let guild = packet.d.guild_id
        let channel = packet.d.channel_id
        const voiceuserobject = {
          user: user,
          guild: guild,
          channel: channel
        }
  
        client.emit('voiceactivity', voiceuserobject)
  
      } else {
        const channel = client.channels.get(packet.d.channel_id);
        // There's no need to emit if the message is cached, because the event will fire anyway for that
        if (channel.messages.has(packet.d.message_id)) return;
        // Since we have confirmed the message is not cached, let's fetch it
        channel.fetchMessage(packet.d.message_id).then(message => {
          // Emojis can have identifiers of name:id format, so we have to account for that case as well
          const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
          // This gives us the reaction we need to emit the event properly, in top of the message object
          const reaction = message.reactions.get(emoji);
          // Adds the currently reacting user to the reaction's users collection.
          if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
          // Check which type of event it is before emitting
          if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
          }
          if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
          }
        });
      }
  
  
    });
  
  

    client.login(client.config.token);
  
  
  
    
  };
  
  init();
