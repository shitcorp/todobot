const { dbinit } = require('../modules/mongohandler')

var CronJob = require('cron').CronJob;

module.exports = async client => {

  await dbinit(client);
  
  // Log that the bot is online.
    client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
      // Make the bot "play the game" which is the help command with default prefix.
     
  
  
    let i = 0;
    var job = new CronJob('0 */10 * * * *', function() {
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

      
      
      client.user.setActivity(stati[i]);
      i++
      if (i === stati.length) {
        i = 0;
      }

    }, null, true, 'America/Los_Angeles');
    job.start();


 
 
    /*
    !Here we check if the database exists, if not were creating it.
    !This is important cause it will create this database if the bot
    !crashed or something else happened
    */
   
    /*
    let servers = client.guilds
    servers.forEach(server => {
    //this method is defined in functions.js, 
    //it will check if the defualt settings db exists
    //and if not it will be created, it will also
    //make sure to instert the default settings
    //params - (tablename, server(in this case the guild object))
    client.createsettingsdbifnotexists("guilddata", server)
    });
    */
  
    
   client.dbcreateconfig();

    
};
