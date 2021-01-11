const { stati } = require('../data/stati.json');
const { job } = require('../modules/cron/every_10_minutes');

module.exports = async (client) => {
  
  // Log that the bot is online.
    client.logger.log(`${client.user.tag}, ready to serve ${await client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");  
    client.user.setActivity("you", { type: "WATCHING" })
    
    let i = 0;
    const statusFunction = async () => {
      client.user.setActivity(stati[i], { type: "WATCHING" });
      i++
      if (i >= stati.length) i = 0;
    }
    
    job.start();
    job.addCallback(statusFunction())
                                                                                                                      
};
