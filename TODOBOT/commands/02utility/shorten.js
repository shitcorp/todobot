const ratecache = new Set()
const fetch = require("node-fetch")
const cooldown = 10000

exports.run = async (client, message, args, level) => {
    
    const timeout = client.config.msgdelete
    
    if (message.deletable) message.delete({ timeout })
   
    const engineerror = () => {
        return message.channel.send(client.error(`
            \`${message.flags[1]}\` does not seem to be a valid shortening engine. The only supported engined are: \`zws\` and \`mini\`. Run \`//help shorten\` for more information.
            `))
    }

    // TODO: make a function for mega links
    const normal = require('../../data/normal_urls.json'); // mini
    const zws = require('../../data/zws_urls.json');

    const guildconf = await client.getconfig(message.guild.id)
    
    let fetchindex;
    let engine;
    
    guildconf.urldomain ? fetchindex = guildconf.urldomain : fetchindex = 1
    guildconf.urlengine ? engine = guildconf.engine : engine = "zws"

    message.flags[0] ? fetchindex = message.flags[0] : null;
    message.flags[1] ? engine = message.flags[1] : null;

    if (typeof zws[fetchindex] === "undefined") {
        return message.channel.send(client.error(`\`${fetchindex}\` does not seem to be a valid domain selector. Run \`//help shorten\` for more information.`));
    }

    if (typeof normal[fetchindex] === "undefined") {
        return message.channel.send(client.error(`\`${fetchindex}\` does not seem to be a valid domain selector. Run \`//help shorten\` for more information.`));
    }

    async function handler() {
        switch (engine) {
            case "zws":
                zwsfetch(zws[fetchindex].baseURL)
                break;
            case "mini":
                minifetch(normal[fetchindex].baseURL)
                break;
            default:
                engineerror()
                break;
        }
    }



    async function zwsfetch(baseURL) {
        fetch(baseURL + `/?url=${args[0]}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: "content"
            })
        })
            .then(res => res.json())
            .then(json => {
                let URL = baseURL + json.zws
                message.channel.send(client.success(`
            Heres your shortened link: ${URL}`))
                console.log(json)

            })
            .catch(e => {
                const bettererror = e.toString().substring(0, 35);
                message.channel.send(client.error(`
            Something went wrong while trying to shorten your link. Try again later of join the official support server (//support) and show me this error:
            \`\`\`${bettererror}\`\`\`
            `))
            })
    }

    async function minifetch(baseURL) {
        const urlToShort = args[0]
        fetch(baseURL + "/shorten/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urlToShort
            })
        })
            .then(res => res.json())
            .then(json => {
                let URL = json.url.replace("http", "https")
                message.channel.send(client.success(`
            Heres your shortened link: ${URL}`))
            })
            .catch(e => {
                const bettererror = e.toString().substring(0, 35);
                message.channel.send(client.error(`
            Something went wrong while trying to shorten your link. Try again later of join the official support server (//support) and show me this error:
            \`\`\`${bettererror}\`\`\`
            `))
            })
    }

    

    /**
     * Ratelimiting is handled here.
     */

    if (ratecache.has(message.author.id)) {
        return message.channel.send(client.error(`
        You are being ratelimited. Ratelimit is set to \`${cooldown / 1000}\` seconds.
         `));
    } else {
        handler()
        ratecache.add(message.author.id)
        setTimeout(() => {
            ratecache.delete(message.author.id)
        }, cooldown)
    }






};



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: ['url'],
    permLevel: "User"
};

exports.help = {
    name: "shorten",
    category: "Utility",
    description: `Shortens the given url with your preset domain.
    > To change the default domain and engine, use the command \`\`\`systemctl -s { urldomain | urlengine } { [1, 2, 3, 4, 5, 6] | [normal, zws] }\`\`\` 
    > 
    > __Available URLs:__
    > 
    > **[1]** => stlf.me/
    > **[2]** => im.rickast.li/
    > **[3]** => m.todo-bot.xyz/
    > **[4]** => join-the.best/
    > **[5]** => ordielikethe.rest/
    > **[6]** => micasaesu.casa/urls
    > 
    > __Engines:__
    > 
    > **[zws]** => Zero width shortener, uses invisible characters. Works only on discord and telegram. Read more about it [here](https://github.com/zws-im/zws  "Github").
    > **[mini]** => Uses normal characters and looks like this: \`stlf.me/hSfuHeK\`. Powererd by [mini]()
    > 
    > __Examples:__
    > \`\`\` //shorten -2 -zws https://google.com => im.rickast.li/\`\`\`
    > \`\`\`//shorten -1 -mini https://google.com => m.stlf.me/hSfuHeK\`\`\`
    > \`\`\`//shorten -3 -mini https://google.com => m.todo-bot.xyz/hSfuHeK\`\`\` 
    
    `,
    usage: "shorten <URL>",
    flags: [
        "-urldomain => Use this to overwrite the default URL setting of your guild. Replace `urldomain` with the desired number See Examples.",
        "-engine => Use this to overwrite the default engine setting of your guild. Replace `engine` with the desired engine. See Examples."
    ]
};

exports.manual = {
    pages: [
        "Url Shortening",
        "later"
    ]
}