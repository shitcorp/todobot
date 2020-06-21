const { RichEmbed } = require('discord.js');
const { exec } = require('discord.js');
const fs = require("fs");


exports.run = async (client, message, args) => {

    client.user.setActivity(`Applying an update!`, { type: 1, browser: "DISCORD IOS"  });

    exec("git pull", (err, out, stderr) => {
        if(!err && stderr === ""){
            console.log(out);
            let update = {
                applied: false,
                channel: msg.channel.id
            };

            fs.writeFileSync("update.json", JSON.stringify(update));
            exec("pm2 restart TODO", (err, out, stderr) => {
                console.log(out)
                if(err && stderr !== "") {
                    message.channel.send(client.error(`${err} \n ${stderr}`))
                }
                message.channel.send(client.success(`Update was pulled and applied.`))
            })
        } else {
            message.channel.send(client.error(`${out} \n\n ${stderr}`))
        }

    })

};


exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "root"
};

exports.help = {
    name: "update",
    category: "System",
    description: "Pulls the latest changes from github.",
    usage: "update"
};