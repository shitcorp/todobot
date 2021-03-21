const { stati } = require('../data/stati.json');
const { MONGO_CONNECTION } = require('../config');
const Agenda= require('agenda')
const agenda = new Agenda({ db: { address: MONGO_CONNECTION } });

module.exports = async (client) => {
  
  // Log that the bot is online.
    client.logger.log(`${client.user.tag}, ready to serve ${await client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");  
    client.user.setActivity("you", { type: "WATCHING" })
    
    let i = 0;

    agenda.define("statusjob", async (job) => {
      client.user.setActivity(stati[i], { type: "WATCHING" });
      i++
      if (i >= stati.length) i = 0;
    });
  
    (async function () {
      // IIFE to give access to async/await
      await agenda.start();
      // Alternatively, you could also do: (every 10 minutes)
      await agenda.every("*/10 * * * *", "statusjob");
    })();


                                                                                                                      
};
