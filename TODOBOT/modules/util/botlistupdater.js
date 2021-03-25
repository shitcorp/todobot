const http = require('./http');

module.exports = (client) => {
    client.updater = {
        updateTopgg: async () => {
            http.setToken(process.env.TOPGG_TOKEN);
            return await http.post(`https://top.gg/api/bots/${process.env.APPLICATION_ID}/stats`, {
                server_count: client.guilds.cache.size
            });
        },
        updateDelly: async () => {
            http.setToken(process.env.DELLY_TOKEN);
            return await http.post(`https://api.discordextremelist.xyz/v2/bot/${process.env.APPLICATION_ID}/stats`, {
                guildCount: client.guilds.cache.size
            });
        },
        updateDBL: async () => {
            http.setToken(process.env.DBL_TOKEN);
            return await http.post(`https://discordbotlist.com/api/v1/bots/${process.env.APPLICATION_ID}/stats`, {
                guilds: client.guilds.cache.size,
                users: 420
            });
        },
        updateBoats: async () => {
            http.setToken(process.env.BOAT_TOKEN);
            return await http.post(`https://discord.boats/api/bot/${process.env.APPLICATION_ID}`, {
                server_count: client.guilds.cache.size
            });
        },
        updateSpace: async () => {
            http.setToken(process.env.SPACE_TOKEN);
            return await http.post(`https://api.botlist.space/v1/bots/${process.env.APPLICATION_ID}`, {
                server_count: client.guilds.cache.size
            });
        },
        updateAll: async () => {
            await client.updater.updateTopgg();
            await client.updater.updateDelly();
            await client.updater.updateDBL();
            await client.updater.updateBoats();
            await client.updater.updateSpace();
        }
    }
};