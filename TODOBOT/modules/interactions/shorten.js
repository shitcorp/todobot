const messages = require('../../localization/messages');
const http = require('../util/http');

module.exports = {
    id: "798890659426992141",
    name: "shorten",
    run: async (client, interaction) => {
        const conf = await client.getconfig(interaction.guild_id)
        const lang = conf ? conf.lang : "en";
        console.log(interaction, interaction.data)
        if (!interaction.data.options) return interactionhandler.embed.error(interaction, messages.nolinkgiven[lang]);
        let { data } = interaction;
        let urlToShort = data.options[0].value
        let response;
        try {
            response = await http.post("https://m.stlf.me/shorten/", JSON.stringify({ urlToShort }))
        } catch(e) {
            if (e.includes("Not Acceptable")) return interactionhandler.embed.error(interaction, messages.notacceptablelink[lang])
            if (e.includes("Too Many Requests")) return interactionhandler.embed.error(interaction, messages.toomanyrequests[lang])
            client.logger.debug(e)
        }
        console.log("res", response)
        if (!response) return interactionhandler.embed.error(interaction, messages.backendoffline[lang]);
        if (response && response.status && response.status >= 500) return interactionhandler.embed.error(interaction, messages.backendoffline[lang])
        let url = response.url ? response.url.replace("http", "https") : messages.somethingwentwrong[lang];
        interactionhandler.embed.success(interaction, messages.shortenedurl[lang] + "\n> " + url, 3);
    }
};