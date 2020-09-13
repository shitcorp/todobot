const ratecache = new Set()
const fetch = require("node-fetch")
const https = require('https');

exports.run = async (client, message, args, level) => {



    const normal = {
        1: {
            baseURL: "https://stlf.me/",
            URL: "stlf.me"
        }
    }

    const zws = {
        1: {
            baseURL: "https://stlf.me/",
            URL: "https://stlf.me/?url="
        }
    }


    const guildconf = await client.getconfig(message.guild.id)
    let fetchindex;
    let engine;
    guildconf.urldomain ? fetchindex = guildconf.urldomain : fetchindex = 1
    guildconf.urlengine ? engine = guildconf.engine : engine = "normal"

    console.log(engine)

    switch (engine) {
        case "zws":
            console.log(zws[fetchindex].URL)
            fetcher(zws[fetchindex].URL, zws[fetchindex].baseURL)
            break;
        case "normal":
            console.log(normal[fetchindex].URL)
            fetcher(normal[fetchindex].URL, normal[fetchindex].baseURL)
            break;
    }


    async function fetcher(hostname, baseURL) {


        const data = JSON.stringify({  });

        const path = `/?url=${args[0]}`
        
        const options = {
            protoco: 'https',
            hostname,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        
        const req = https.request(options, (res) => {
            let data = '';
        
            res.on('data', (chunk) => {
                data += chunk;
            });
        
            res.on('end', () => {
                const json = JSON.parse(data)
                console.log(json)
                message.channel.send(`Heres your shortened URL: ${baseURL}${json.zws}`)
                
            });

            res.on('error', () => {
                console.log("b")
            })
        
        }).on("error", (err) => {
            console.log("Error: ", err.message);
        });
        
        req.write(data);
        req.end();
        




    }


    // if (ratecache.has(message.author.id)) {
    //     return;
    // } else {
    //     fetcher()
    //     ratecache.add(message.author.id)
    //     setTimeout(() => {
    //         ratecache.delete(message.author.id)
    //     }, 5000)
    // }






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
    > **[3]** => u.todo-bot.xyz/
    > **[4]** => join-the.best/
    > **[5]** => ordielikethe.rest/
    > **[6]** => micasaesu.casa/urls
    > 
    > __Engines:__
    > 
    > **[zws]** => Zero width shortener, uses invisible characters. Works only on discord and telegram. Read more about it [here](https://github.com/zws-im/zws  "Github").
    > **[normal]** => Uses normal characters and looks like this: \`stlf.me/hSfuHeK\`
    > 
    > __Examples:__
    > \`\`\` //shorten -2 -zws https://google.com => im.rickast.li/\`\`\`
    > \`\`\`//shorten -1 -normal https://google.com => stlf.me/hSfuHeK\`\`\` 
    
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