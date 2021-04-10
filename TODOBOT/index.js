(require('dotenv').config());

const apm = require('elastic-apm-node')

apm.start({
  serverUrl: process.env.DEBUG_URL_APM_SERVER,
  serviceName: process.env.BOT_NAME,
  environment: process.env.ELASTIC_ENV
  // uncomment this for troubleshooting the apm agent
  // logLevel: 'trace',
})


const readdir = require('util').promisify(require("fs").readdir);
const Enmap = require("enmap");
const redis = require("redis");
const { Agenda } = require('agenda');
const API = require('./classes/api');
const handle = require('./modules/util/interactionhandler');
const agenda = new Agenda({
  db: {
    address: process.env.MONGO_CONNECTION ?? 'mongodb://localhost:27017/todobot',
    options: {
      useUnifiedTopology: true
    }
  }
});

const { Client } = require("discord.js-light");

const client = new Client({
  partials: ['GUILDS', 'MESSAGE', 'CHANNEL', 'REACTION', 'MEMBERS'],
  disableMentions: "everyone",
  disableMentions: "here",
  cacheGuilds: true,
  cacheChannels: true,
  cacheOverwrites: false,
  cacheRoles: true,
  cacheEmojis: true,
  cachePresences: false,
  cacheMembers: false,
  ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
});

client.apm = apm;
client.cooldown = parseInt(process.env.CMD_COOLDOWN) ?? 30000;

client.logger = require("./modules/util/Logger");

client.logger.debug = (err) => {
  console.error(err);
  client.logger.Error(err);
  client.apm.captureError(err);
}
client.logger.error = (err) => client.logger.debug(err)


/**
 * Handle redis client errors here
 */
client.cache = redis.createClient({
  host: process.env.REDIS_ADDRESS,
  port: process.env.REDIS_PORT
});

client.cache.on("error", (err) => client.logger.debug(err))
client.cache.on("ready", () => client.logger.redis(`Redis client is ready.`))


require('./modules/util/functions.js')(client);
require('./modules/util/permissions')(client);
require('./modules/util/embeds.js')(client);
require('./modules/util/emojis')(client);


client.commands = new Enmap();
client.aliases = new Enmap();
client.interactions = new Enmap();

const loadAndInjectClient = async (path) => {
  (await readdir(path)).forEach(handlerFile => {
    if (handlerFile.endsWith('.js')) require(path + '/' + handlerFile)(client);
  })
}



(async function init() {

  // load all important handlers and inject a client instance
  await loadAndInjectClient(__dirname + '/modules/handlers');

  // connect to mongodb and pull guild configs into cache
  await client.dbinit();

  async function loadCategory(category) {
    const cmdFilesFun = await readdir(__dirname + `/commands/${category}/`);
    cmdFilesFun.forEach(f => {
      if (!f.endsWith(".js")) return;
      const response = client.loadCommand(category, f);
      if (response) throw new Error(response);
    });
  }

  /**
   * The foldernames where the commands are placed in will
   *  be the categories they are shown in
   */
  (await readdir(__dirname + '/commands/')).forEach(category => loadCategory(category));


  (await readdir(__dirname + "/events/")).forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log({ module:`EVENTLOADER`, message: `Loading Event: ${eventName}` });
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });


  (await readdir(__dirname + '/interactions/')).forEach(file => {
    const interactionName = file.split(".")[0];
    if (file.includes('.template')) return;
    client.logger.log({ module: `INTERACTION_LOADER`, message: `Loading: ${interactionName}`});
    client.interactions.set(interactionName, (require(__dirname + '/interactions/' + file)));
  })




  // start the API
  new API(client, process.env.HEALTH_ENDPOINT_PORT);

  // login the bot
  process.env.DEV === 'true' ? client.login(process.env.DEV_TOKEN) : client.login(process.env.TOKEN);


  // take care of scheduling
  agenda.define("reminderjob", async (job) => client.reminderjob());

  await agenda.start();
  // Alternatively, you could also do: (every 1 minute)
  await agenda.every("*/1 * * * *", "reminderjob");

  // this is for development reasons so the data for my dev server is always fresh
  client.invalidateCache('709541114633519177')
  client.cache.set('686669011601326281')

  // interaction"handler"
  client.ws.on("INTERACTION_CREATE", async (raw_interaction) => await handle(client, raw_interaction));



})();




