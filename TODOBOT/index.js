const Discord = require('discord.js'),
  { readdir } = require('fs'),
  Enmap = require('enmap'),
  chalk = require('chalk'),
  redis = require('redis'),
  { job } = require('./modules/cron/every_2_minutes');

const rdir = (path, options) => new Promise((resolve, reject) => readdir(path, options, (err, files) => err && reject(err) || resolve(files)));

const client = {
  ...new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    disableMentions: 'everyone',
    disableMentions: 'here'
  }),
  commands: new Enmap(),
  aliases: new Enmap(),
  config: require('./config'),
  logger: require('./modules/logger'),
  levelCache: Object.fromEntries(client.config.permLevels.map(pl => [pl.name, pl.level])),
  cache: redis.createClient({
    host: 'localhost',
    port: 6379
  })
};

require('./modules/mongohandler.js')(client);
require('./modules/taghandler.js')(client);
require('./modules/functions.js')(client);
require('./modules/embeds.js')(client);

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

  client.login(client.config.token);

  job.start();
  job.addCallback(client.reminderJob);
})();
