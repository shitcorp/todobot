const { CronJob } = require('cron');

module.exports = async (client) => {
  await client.dbinit();
  client.logger.ready(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`);  
  let i = 0;
  new CronJob('0 */10 * * * *', () => {
    let stati = [
      'Use //suggest to suggest new features!',
      'Use //support to join the official support server',
      'Bot is updating in roughly 3 - 4 days, just so that you know. Since I`m moving databases there could be some data loss!',
      'Subscribe to Pewdiepie!',
      'Drink more water.',
      'Take care of each other.',
      '#BLM ✊',
      '//help  || invite.todo-bot.xyz',
      'Yandere Dev on Youtube',
      'Peace',
      'the world burn.',
      'you.',
      'not p*rnhub since we do not support rape and or sex trafficing. Do your homework.',
      '//help  || invite.todo-bot.xyz'
    ]
    client.user.setActivity(stati[i++ % stati.length]);
  }, null, true, 'America/Los_Angeles').start();
};
