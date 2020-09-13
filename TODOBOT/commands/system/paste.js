const fetch = require('node-fetch')

exports.run = async (client, message, args, level) => {
    
    const { URL, API } = require('../../data/pasty_url.json');

    const content = args.join(" ")

    fetch(API + "/pastes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content
        })
    })
    .then(response => response.json())
    .then(json => {

        message.author.send(client.success(`Pasty Summary:
        **Link**: ${URL}${json.id}
        **Deletion Token**: 
        > ||${json.deletionToken}||
        `)).catch(e => {
            message.channel.send(client.error(`
            I am unable to send you direct messages so heres your **deletion token**. Save it as it will be required when you want to delete the pasty again.
            
            > **Token:** ||${json.deletionToken}||
            `))
        })

        message.channel.send(client.success(`
        **Heres your pasty link:** ${URL}${json.id}
        `))
        
    })
    .catch(e => {
        console.log(e)
        const bettererror = e.toString().substring(0, 35);
        message.channel.send(client.error(`Something went wrong when trying to save your pasty. Try again later of join the official support server (//support) and show me this error:
        \`\`\`${bettererror}\`\`\`
        `))
    })
   


};



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "paste",
    category: "Utility",
    description: "Paste some code and get a link to send it to your friends or link the code snippet in announcements/posts. The bot will send you a deletion token that is required for when you want to delete the pase at any given point.",
    usage: "paste <CODE>"
};