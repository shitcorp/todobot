const Discord = require('discord.js'),
  { readdir } = require('fs'),
  Enmap = require('enmap'),
  chalk = require('chalk'),
  redis = require('redis'),
  job = require('./modules/cron/every_2_minutes'),
  config = require('dotenv').config();

if (config.error) {
  client.logger.log(`${chalk.bgRed('[ERROR]')} Could not load environment variabels from '.env' file. Exiting...`);
  process.exit(-1)
}

const rdir = (path, options) => new Promise((resolve, reject) => readdir(path, options, (err, files) => err && reject(err) || resolve(files)));

const client = {
  ...new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    disableMentions: 'everyone',
    disableMentions: 'here'
  }),
  commands: new Enmap(),
  aliases: new Enmap(),
  logger: require('./modules/logger'),
  permLevels: Object.fromEntries(require('./modules/permLevels').map(pl => [pl.level, { name: pl.name, check: pl.check }])),
  cache: redis.createClient({
    host: 'localhost',
    port: 6379
  })
};

[require('./modules/mongoHandler.js'), require('./modules/tagHandler.js'), 
  require('./modules/functions.js'), require('./modules/embeds.js')].forEach(f => f(client))

client.cache.on('error', (err) => client.logger.debug(err));
client.cache.on('ready', () => client.logger.ready(`Redis client is ready.`));

(async () => {
  async function load(category) {
    const files = (await rdir(`./commands/${category}/`)).filter(file => file.endsWith('.js'));
    client.logger.log(`${chalk.bgBlue('[CATGEORY]')} [${name}] [COMMANDS: ${chalk.green(files.length)}]`);
    files.forEach(file => client.loadCommand(category.toUpperCase(), file));
  }

  (await rdir('./commands')).forEach(load);

  const files = await rdir('./events');
  client.logger.log(`${chalk.bgBlue('[EVENTS]')} Loading ${chalk.green(files.length)} events.`);
  for (const file of files) {
    const event = file.split('.')[0];
    client.logger.log(`[EVENT] Loading Event: ${event}`);
    client.on(event, require(`./events/${file}`).bind(null, client));
  }

  client.login(process.env.TOKEN);

  job.start();
  job.addCallback(client.reminderJob);
})();
