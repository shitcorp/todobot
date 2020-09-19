const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const chalk = require("chalk");
const redis = require("redis");
const { job } = require("./modules/cron/every_2_minutes")


const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const rclient = redis.createClient({
  host: "127.0.0.1",
  port: 6379
})


client.config = require("./config.js");
client.logger = require("./modules/Logger");
client.cache = rclient;

require("./modules/mongohandler.js")(client);
require("./modules/taghandler.js")(client);
require("./modules/functions.js")(client);
require("./modules/embeds.js")(client);



/**
 * Handle caching and redis client here
 */

  client.cache.on("error", (err) => {
    client.logger.debug(err)
  })

  client.cache.on("ready", () => {
    client.logger.ready(`Redis client is ready.`)
  })






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
  
    /**
     * The foldernames where the commands are placed in will
     *  be the categories they are shown in
     */
    
    let categories = await readdir('./commands');
    categories.forEach(cat => {
      load(cat)
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



    

    client.login(client.config.token);

    // start the reminder cron job
    job.start()
    job.addCallback(client.remindercore())
  
  
  
    
  };
  
  init();
