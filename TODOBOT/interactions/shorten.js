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
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {
        const conf = interaction.conf;
        console.log(conf)
        const lang = 'en';
        let domain = "https://m.stlf.me/"
        if (!interaction.data.options) return interaction.errorDisplay(client.error(messages.nolinkgiven[lang]));
        const { data } = interaction;
        const urlToShort = data.options[0].value
        if (data.options[1] && data.options[1].name === "domain") domain = data.options[1].value
        if (!domain.startsWith("http")) domain = "https://" + domain
        let response;
        try {
            response = await http.post(domain, JSON.stringify({ urlToShort }))
        } catch (e) {
            if (e.toString().includes("Not Acceptable")) return interaction.errorDisplay(messages.notacceptablelink[lang])
            if (e.toString().includes("Too Many Requests")) return interaction.errorDisplay(messages.toomanyrequests[lang])
            client.logger.debug(e)
        }
        
        if (!response) return interaction.errorDisplay(messages.backendoffline[lang]);
        if (response && response.status && response.status >= 500) return interaction.errorDisplay(messages.backendoffline[lang])
        let url = response.url ? response.url.replace("http", "https") : messages.somethingwentwrong[lang];
        interaction.replyWithMessageAndDeleteAfterAWhile(client.success(messages.shortenedurl[lang] + "\n> " + url, 3));
    }
};