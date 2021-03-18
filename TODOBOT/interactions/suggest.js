const { MessageEmbed } = require('discord.js');

const raw = {
    name: 'suggest',
    description: 'Suggest new features to be added into the bot',
    options: [
        {
            name: 'text',
            description: 'Your suggestion',
            type: 3,
            required: true
        },
        {
            name: 'image',
            description: 'If you want to attach an image, paste the link here',
            type: 3,
            required: false
        },
        {
            name: 'hidden',
            description: 'Hide the server where this suggestion was sent',
            // type 5 == boolean
            type: 5,
            required: false
        }
    ]
};

module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description,
        tutorial: {
            text: '',
            media: '',
        }
    },
    run: async (client, interaction) => {
        
        let text, image, hidden;
        console.log(interaction.data.options)
        for (let i= 0; i < interaction.data.options.length; i++) {
            if (interaction.data.options[i].name === 'text') text = interaction.data.options[i].value;
            if (interaction.data.options[i].name === 'image') image = interaction.data.options[i].value;
            if (interaction.data.options[i].name === 'hidden') hidden = interaction.data.options[i].value;
        }
        console.log(text, image, hidden);



        const embed = new MessageEmbed()
        .setTitle(`New Suggestion:`)
        .setColor('BLUE')
    
        let footer = `Submitted by: ${interaction.member.user.username}#${interaction.member.user.discriminator}`;
        if (interaction.guild_id !== process.env.MOTHER_GUILD && !hidden) {
            footer += `; Sent in server: ${client.guilds.cache.get(interaction.guild_id).name}`;
        }
    
        if (image && image.startsWith(`https://`)) {
            embed.setImage(image)        
        }
    
        //cdn.discordapp.com/avatars/ user.id + user avatar + .png
        // cdn.discordapp.com/avatars/686669011601326281/a_df20ff839094f1ee656c9dfa6c53e53f.png
        console.log(interaction.member)
        embed.setThumbnail('https://cdn.discordapp.com/avatars/' + interaction.member.user.id + '/' + interaction.member.user.avatar + '.gif')
        embed.setDescription(`> ${text}`)
        embed.setFooter(footer);
    
        let G = client.guilds.cache.get(process.env.MOTHER_GUILD).channels.cache.get(process.env.SUGGESTIONS_CHANNEL)
    
        try {
            G.send(embed).then(async msg => {
                await msg.react(client.emojiMap['upvote']);
                await msg.react(client.emojiMap['downvote']);
            })
            interactionhandler.embed.success(interaction, `Your feature request has been submitted.`)
        } catch(e) {
            interactionhandler.embed.error(interaction, `There was an error trying to post your suggestions. Was your image URL well formatted?`)
        }




    }

};