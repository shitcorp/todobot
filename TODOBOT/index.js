(require('dotenv').config());

// const apm = require('elastic-apm-node').start({
//   serverUrl: 'http://localhost:8200',
//   serviceName: 'TodoDiscordBot',
//   environment: process.env.DEV ? 'development' : 'production'
// })

const readdir = require('util').promisify(require("fs").readdir);
const Enmap = require("enmap");
const redis = require("redis");
const Agenda = require('agenda');
const Interaction = require('./classes/interaction');
const agenda = new Agenda({ db: { address: process.env.MONGO_CONNECTION } });

const Discord = require("discord.js-light");
const client = new Discord.Client({
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
  ws: { intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
});


client.cache = redis.createClient({
  host: process.env.REDIS_ADDRESS,
  port: process.env.REDIS_PORT
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
  'downvote': '<:downvote:820677972645642290>',
  'expand': '<:expand:822466806211543080>',
  'collapse': '<:collapse:822467028983873606>',
  'accept': '<:accept_todo:822495794602442814>'
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

  // load all important handlers and inject a client instance
  await loadAndInjectClient(__dirname + '/modules/handlers');

  // connect to mongodb and pull guild configs into cache
  await client.dbinit();

  async function loadCategory(category) {
    const cmdFilesFun = await readdir(__dirname + `/commands/${category}/`);
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
  (await readdir(__dirname + '/commands/')).forEach(category => loadCategory(category));


  (await readdir(__dirname + "/events/")).forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`[EVENT] Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });


  (await readdir(__dirname + '/interactions/')).forEach(file => {
    const interactionName = file.split(".")[0];
    if (file.includes('.template')) return;
    client.logger.log(`[INTERACTION] Loading: ${interactionName}`);
    client.interactions.set(interactionName, (require(__dirname + '/interactions/' + file)));
  })





  process.env.DEV === 'true' ? client.login(process.env.DEV_TOKEN) : client.login(process.env.TOKEN);


  agenda.define("reminderjob", async (job) => {
    client.reminderjob()
  });

  // IIFE to give access to async/await
  await agenda.start();
  // Alternatively, you could also do: (every 2 minutes)
  await agenda.every("*/1 * * * *", "reminderjob");


  client.invalidateCache('709541114633519177')

  // interaction"handler"
  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    client.logger.cmd(`Received the interaction ${interaction.data.name}`)
    try {
      let conf = await client.getconfig(interaction.guild_id)
      // if the user or channel are blacklisted we return an error
      if (conf && Object.values(conf.blacklist_users).includes(interaction.member.user.id)) return interactionhandler.embed.error(interaction, 'You are blacklisted from using the bot.');
      if (conf && Object.values(conf.blacklist_channels).includes(interaction.channel_id)) return;
      (client.interactions.get(interaction.data.name)).run(client, new Interaction(client, interaction));
    } catch (e) {
      console.log(e);
      console.error(e);
      client.logger.debug(e);
      interactionhandler.embed.error(interaction, 'An error occured, please try again.');
    }
  });


})();


