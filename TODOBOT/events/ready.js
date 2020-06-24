var cron = require('node-cron');

module.exports = async client => {
 
  // Log that the bot is online.
    client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");
      // Make the bot "play the game" which is the help command with default prefix.
    client.user.setActivity(`//help  || invite.todo-bot.xyz`, { type: 3, browser: "DISCORD IOS"  });
  
  
    cron.schedule('*/7 * * * *', () => {
      let stati = [
        '//help  || invite.todo-bot.xyz',
        'Use //suggest to suggest new features!',
        'Use //support to join the official support server',
        'Bot is updating in roughly 3 - 4 days, just so that you know. Since I`m moving databases there could be some data loss!'
      ]
      const randomstatus = stati[Math.floor(Math.random()*stati.length)]
      client.user.setActivity(randomstatus, { type: 3, browser: "DISCORD IOS"  });
    });
 
 
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
