const messages = require('../localization/messages');
const http = require('../modules/util/http');


const raw = {
    name: "shorten",
    description: "Shorten a link.",
    required: true,
    options: [
        {
            name: "Link",
            description: "The link that you want to get shortened.",
            required: true,
            type: 3
        },
        {
            name: "Domain",
            description: "The domain you want to use for your shortened link.",
            type: 3,
            choices: [
                {
                    name: "stlf.me",
                    value: "m.stlf.me"
                },
                {
                    name: "heres-the.link",
                    value: "heres-the.link"
                },
                {
                    name: "todo-bot.xyz",
                    value: "m.todo-bot.xyz"
                }
            ]
        }
    ]
}

module.exports = {
    raw,
    id: "",
    name: raw.name,
    conf: {
        enabled: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {
        const conf = await client.getconfig(interaction.guild_id)
        console.log(conf)
        const lang = 'en';
        let domain = "https://m.stlf.me/"
        if (!interaction.data.options) return interactionhandler.embed.error(interaction, messages.nolinkgiven[lang]);
        const { data } = interaction;
        const urlToShort = data.options[0].value
        if (data.options[1] && data.options[1].name === "domain") domain = data.options[1].value
        if (!domain.startsWith("http")) domain = "https://" + domain
        let response;
        try {
            response = await http.post(domain, JSON.stringify({ urlToShort }))
        } catch (e) {
            if (e.toString().includes("Not Acceptable")) return interactionhandler.embed.error(interaction, messages.notacceptablelink[lang])
            if (e.toString().includes("Too Many Requests")) return interactionhandler.embed.error(interaction, messages.toomanyrequests[lang])
            client.logger.debug(e)
        }
        //console.log("res", response)
        if (!response) return interactionhandler.embed.error(interaction, messages.backendoffline[lang]);
        if (response && response.status && response.status >= 500) return interactionhandler.embed.error(interaction, messages.backendoffline[lang])
        let url = response.url ? response.url.replace("http", "https") : messages.somethingwentwrong[lang];
        interactionhandler.embed.success(interaction, messages.shortenedurl[lang] + "\n> " + url, 3);
    }
};