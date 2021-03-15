// const apm = require('elastic-apm-node').start({
//   serverUrl: 'http://localhost:8200',
//   serviceName: 'TodoDiscordBot',
//   environment: 'production'
// })

const Discord = require("discord.js");
const readdir = require('util').promisify(require("fs").readdir);
const Enmap = require("enmap");
const chalk = require("chalk");
const redis = require("redis");
const { job } = require("./modules/cron/every_2_minutes");


const client = new Discord.Client({
  partials: ['GUILDS', 'MESSAGE', 'CHANNEL', 'REACTION'],
  disableMentions: "everyone",
  disableMentions: "here"
});

// client.apm = apm;

client.cache = redis.createClient({
  host: "127.0.0.1",
  port: 6379
});

client.config = require("./config.js");
client.logger = require("./modules/util/Logger");

require("./modules/util/functions.js")(client);
require("./modules/util/embeds.js")(client);



/**
 * Handle caching and redis client here
 */

  client.cache.on("error", (err) => {
    client.logger.debug(err)
  })

  client.cache.on("ready", () => {
    client.logger.redis(`Redis client is ready.`)
  })



  // we need this for the task reactions
  client.emojiMap = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    10: '🔟',
    '-': '🟥',
    '+': '🟩',
    'edit': '<:edit:820577055342985216>',
    'finish': '<:finish:820576533059600394>',
    'assign': '<:assign_yourself:820577858081521675>',
    'github': '<:github:820639615990890496>',
    'share': '<:share:820419979719344139>',
    'task_open': '<:task_open:820381667881517118>',
    'task_finished': '<:task_finished:820384679562838046>',
    'upvote': '<:upvote:820678243828105216>',
    'downvote': '<:downvote:820677972645642290>'
    }

    client.Mapemoji = {
      '1️⃣': 1, 
      '2️⃣': 2, 
      '3️⃣': 3, 
      '4️⃣': 4, 
      '5️⃣': 5, 
      '6️⃣': 6, 
      '7️⃣': 7, 
      '8️⃣': 8, 
      '9️⃣': 9, 
      '🔟': 10, 
    }
  
  
  
  client.commands = new Enmap();
  client.aliases = new Enmap();
  client.interactions = new Enmap();
  
  const loadAndInjectClient = async (path) => {
    (await readdir(path)).forEach(handlerFile => {
      if (handlerFile.endsWith('.js')) require(path + '/' + handlerFile)(client);
    })
  }



(async function init() {
  
  
  await loadAndInjectClient(__dirname + '/modules/handlers');

  await client.dbinit();

    async function load(category) {
      let name = category.toUpperCase()
      const cmdFilesFun = await readdir(__dirname + `/commands/${category}/`);
      let amount = cmdFilesFun.length
      client.logger.log(`${chalk.bgBlue("[CATGEORY]")} [${name}] [COMMANDS: ${chalk.green(amount)}]`);
      cmdFilesFun.forEach(f => {
        if (!f.endsWith(".js")) return;
        const response = client.loadCommand(category, f);
        if (response) console.log(response)
      });
    }
  
    /**
     * The foldernames where the commands are placed in will
     *  be the categories they are shown in
     */
    
    let categories = await readdir(__dirname + '/commands/');
    categories.forEach(cat => load(cat))  
  
  
  
    const evtFiles = await readdir(__dirname + "/events/");
    client.logger.log(`${chalk.bgBlue("[EVENTS]")} Loading ${chalk.green(evtFiles.length)} events.`);
    evtFiles.forEach(file => {
      const eventName = file.split(".")[0];
      client.logger.log(`[EVENT] Loading Event: ${eventName}`);
      const event = require(`./events/${file}`);
  
      client.on(eventName, event.bind(null, client));
    });


    const interactionFiles = await readdir(__dirname + '/modules/interactions/');
    client.logger.log(`${chalk.bgBlue("[INTERACTIONS]")} Loading ${chalk.green(interactionFiles.length)} interactions.`);
    interactionFiles.forEach(file => {
      const interactionName = file.split(".")[0];
      client.logger.log(`[INTERACTION] Loading: ${interactionName}`);
      client.interactions.set(interactionName, (require(__dirname + '/modules/interactions/' + file)));
    })



  
    
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }




    client.config.dev ? client.login(client.config.devtoken) : client.login(client.config.token);

    // start the reminder cron job
    job.start()
    job.addCallback(() => { client.reminderjob() })

    
    // interaction"handler"
    client.ws.on("INTERACTION_CREATE", async (interaction) => {
      client.logger.cmd(`Received the interaction ${interaction.data.name}`)
      try {
        (client.interactions.get(interaction.data.name)).run(client, interaction);
      } catch (e) {
        client.logger.debug(e);
      }
    });
  
    
  })();


