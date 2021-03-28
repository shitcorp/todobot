(require('dotenv').config());

const apm = require('elastic-apm-node')
apm.start({
  serverUrl: process.env.DEBUG_URL_APM_SERVER,
  serviceName: process.env.BOT_NAME,
  environment: process.env.DEV !== true ? 'production' : 'development',
  // uncmment this for troubleshooting the apm agent
  // logLevel: 'trace',
  logger: require('bunyan')({ name: 'APM_AGENT', level: 'info' })
})

const interactionRecently = new Set()
const readdir = require('util').promisify(require("fs").readdir);
const Enmap = require("enmap");
const redis = require("redis");
const Agenda = require('agenda');
const API = require('./classes/api');
const Interaction = require('./classes/interaction');
const agenda = new Agenda({
  db: {
    address: process.env.MONGO_CONNECTION ?? 'mongodb://localhost:27017/todobot',
    options: {
      useUnifiedTopology: true
    }
  }
});

const { Client } = require("discord.js-light");
const messages = require('./localization/messages');

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
  ws: { intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
});

//client.apm = apm;
client.cooldown = parseInt(process.env.CMD_COOLDOWN) ?? 30000;
client.logger = require("./modules/util/Logger");


client.cache = redis.createClient({
  host: process.env.REDIS_ADDRESS,
  port: process.env.REDIS_PORT
});

const getAsync = require('util').promisify(client.cache.get).bind(client.cache);


client.logger.debug = (err) => {
  client.logger.Error(err);
  client.apm.captureError(err);
}
client.logger.error = (err) => client.logger.debug(err)



require("./modules/util/botlistupdater.js")(client);
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

client.permMap = {
  'USER': 0,
  'BOT_USER': 1,
  'STAFF': 2
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




  // start the API
  new API(client, process.env.HEALTH_ENDPOINT_PORT);

  // login the bot
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
  client.ws.on("INTERACTION_CREATE", async (raw_interaction) => {
    const interaction = new Interaction(client, raw_interaction)
    if (interactionRecently.has(raw_interaction.member.user.id)) {
      return interaction.errorDisplay(`You are being ratelimited. Please wait ${client.cooldown / 1000}s before trying again.`)
    } else {
      raw_interaction.level = 0;

      const isThere = await getAsync(interaction.member.user.id);
      const iscmd = await client.interactions.get(interaction.data.name)

      if (iscmd && iscmd.conf.premium !== false && isThere === null) return interaction.errorDisplay(`
      This command requires you to vote on [top.gg](https://top.gg/bot/709541772295929909/vote). 
      
      > Once voted you can use the command for the next 24 hours (or as long as your user id is in the bots cache so if an error occures lucky you :D)
      `)

      client.logger.cmd(`Received the interaction ${interaction.data.name} from ${interaction.member.user.username}#${interaction.member.user.discriminator}`)
      try {
        const trans = apm.startTransaction('Interaction Handler', 'handler', {
          startTime: Date.now()
        })
        apm.setUserContext({
          id: interaction.member.user.id,
          username: interaction.member.user.username
        })
        const span = trans.startSpan(interaction.data.name, 'discord_interaction', {
          startTime: Date.now()
        })
        let conf = await client.getconfig(interaction.guild_id)
        // if the user or channel are blacklisted we return an error
        if (conf && Object.values(conf.blacklist_users).includes(interaction.member.user.id)) return interaction.errorDisplay(messages.blacklisted[interaction.conf ? interaction.conf.lang ? interaction.conf.lang : 'en' : 'en']);
        if (conf && Object.values(conf.blacklist_channels).includes(interaction.channel_id)) return interaction.errorDisplay(messages.blacklisted[interaction.conf ? interaction.conf.lang ? interaction.conf.lang : 'en' : 'en']);
        // user is a normal bot user
        if (conf && findCommonElements(conf.userroles, interaction.member.roles)) interaction.level = 1;
        // user is a staff member and can change bot settings
        if (conf && findCommonElements(conf.staffroles, interaction.member.roles)) interaction.level = 2;
        interaction.lang = conf ? conf.lang ? conf.lang : 'en' : 'en';
        interaction.conf = conf;
        // this is important for the initial setup where the user has to set
        // a staff role so we need something to detemrmine they are permitted
        if (interaction.GuildMember.hasPermission('MANAGE_GUILD')) interaction.level = 2;
        const cmd = client.interactions.get(interaction.data.name)

        if (interaction.level < client.permMap[cmd.conf.permLevel]) return interaction.errorDisplay(messages.permissionleveltoolow[interaction.conf ? interaction.conf.lang ? interaction.conf.lang : 'en' : 'en'])

        cmd.run(client, interaction);
        span.end()
        apm.endTransaction('success', Date.now())

        // interaction cooldown
        interactionRecently.add(raw_interaction.member.user.id)
        setTimeout(() => { interactionRecently.delete(raw_interaction.member.user.id) }, client.cooldown)

      } catch (e) {
        console.error(e);
        client.logger.debug(e);
        interaction.errorDisplay(messages.generalerror[interaction.conf ? interaction.conf.lang ? interaction.conf.lang : 'en' : 'en']);
        if (interaction.member.user.id === process.env.OWNER) interaction.errorDisplay(e);
      }
    }
  });



})();




