/**
 * @fileoverview
 * 
 * Add the mentioned user(s) or channel(s)
 * to the according array.
 * 
 * Usage:
 * 
 * blacklist -u @User1 @User2 => Blacklist users
 * 
 * blacklist -c #Channel1 #Channel2 => Blacklist channels
 * 
 */

const { configmodel } = require('../../modules/models/configmodel')

exports.run = async (client, message, args, level) => {

    const settings = await client.getconfig(message.guild.id)
    const _id = message.guild.id

    // main command "handler"
    switch (message.flags[0]) {
        case "u":
        case "user":
            // blacklist users here
            blacklistUser()
            break;
        case "c":
        case "chan":
        case "channel":
            // blacklist channel here
            blacklistChannel()
            break;
        default:
            errormsg()
    }


    async function blacklistUser() {
        // if this doesnt exist we have to append that to the mongoose
        // doc and kindly ask the user to try again
        if (settings.blacklist_users) {
            let blacklist = []
            // turn the object from cache into an array for easier handling
            Object.keys(settings.blacklist_users).forEach(key => {
                blacklist.push(settings.blacklist_users[key])
            })
            // if there are mentioned users in the message,
            // create an array from said mentions and push
            // the elements to our temporary blacklist array
            if (message.mentions.users.size > 0) {
                let cache = Array.from(message.mentions.users.keys())
                cache.length > 0 ? cache.forEach(el => { if (!blacklist.includes(el)) { blacklist.push(el) } else { message.channel.send(client.error(`This user is already blacklisted.`)) } }) : null;
            } else message.channel.send(client.error(`You have to mention one or multiple user(s) to blacklist them.`))
            console.log(blacklist)
            // update the guildconfig with the new in the database
            configmodel.updateOne({ _id }, { blacklist_users: blacklist }, (err, affected, resp) => {
                if (err) client.logger.debug(err.toString())
                client.invalidateCache(message.guild.id)
                message.channel.send(client.success(`**Updated your blacklist.**`))
            })
        } 
    };


    async function blacklistChannel() {

    };

    async function errormsg() {
        return message.channel.send(client.error(`**This flag does not seem to be supported.**
            
        __**Supported Flags are:**__ 

        > ${client.commands.get("blacklist").help.flags.join("\n> ")}
        
        *For more information run \`//help blacklist\`*`))
    }


};



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "blacklist",
    category: "System",
    description: "Blacklist one or more users or channels from using the bot on your server.",
    usage: `blacklist -u @User1 @User2 => Blacklist users
    > blacklist -c #Channel1 #Channel2 => Blacklist channels
    
    You can mention mulitple users as well as channels when blacklisting. This also applies for the whitelist command.`,
    flags: [
        `-u => Blacklist user(s)`,
        `-user => Blacklist user(s)`,
        `-v => View your blacklists`,
        `-view => View your blacklists`,
        `-c => Blacklist channel(s)`,
        `-chan => Blacklist channel(s)`,
        `-channel => Blacklist channel(s)`
    ]
};