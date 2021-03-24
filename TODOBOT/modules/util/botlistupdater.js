const http = require('./http');

module.exports = (client) => ({
    ...client,
    updateTopgg: async () => {
        http.setToken(process.env.TOPGG_TOKEN);
        const response = await http.post(`https://top.gg/api/bots/${client.user.id}/stats`, {
            server_count: client.guilds.cache.size
        });
        console.log(response);
    },
    updateDelly: async () => {
        http.setToken(process.env.DELLY_TOKEN);
        const response = await http.post(`https://api.discordextremelist.xyz/v2/bot/${client.user.id}/stats`, {
            guildCount: client.guilds.cache.size
        });
        console.log(response);
    },
    updateDBL: async () => {
        http.setToken(process.env.DBL_TOKEN);
        const response = await http.post(`https://discordbotlist.com/api/v1/bots/${client.user.id}/stats`, {
            guilds: client.guilds.cache.size
        });
        console.log(response);
    },
    updateBoats: async () => {
        http.setToken(process.env.BOAT_TOKEN);
        const response = await http.post(`https://discord.boats/api/bot/${client.user.id}`, {
            server_count: client.guilds.cache.size
        });
        console.log(response);
    },
    updateSpace: async () => {
        http.setToken(process.env.SPACE_TOKEN);
        const response = await http.post(`https://api.botlist.space/v1/bots/${client.user.id}`, {
            server_count: client.guilds.cache.size
        });
        console.log(response);
    },
    updateAll: async () => {
        await client.updateTopgg();
        await client.updateDelly();
        await client.updateDBL();
        await client.updateBoats();
        await client.updateSpace();
    }



});