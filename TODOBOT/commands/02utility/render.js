const converter = new (require('showdown')).Converter(),
    imgMaker = require('node-html-to-image'),
    { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    run: async (_client, message, args, _level) => {
        async function renderer(transparent) {
            if (args[0].includes('```md')) {
                const markdown = message.content.split('\n').splice(1).join('\n').replace(/`{3}.*/g, '').trim();
                const img = await imgMaker({ 
                    html: converter.makeHtml(markdown), 
                    transparent, 
                    puppeteerArgs: { args: ['--no-sandbox'] }
                });
                let dur = Date.now() - message.createdTimestamp;
                await message.channel.send(new MessageEmbed()
                    .setFooter(`Rendered for ${message.author.tag} in ${dur/1000} s`, message.author.avatarURL)
                    .setColor('#303136')
                    .attachFiles([new MessageAttachment(img, 'render.png')])
                    .setImage('attachment://render.png'));
            } else if (args[0].includes('```html')) {
                if (message.author.id !== '686669011601326281') 
                    return;
                const html = message.content.split('\n').splice(1).join('\n').replace(/`{3}.*/g, '').trim();
                const img = await imgMaker({ 
                    html, 
                    transparent, 
                    puppeteerArgs: { args: ['--no-sandbox'] }
                });
                let dur = Date.now() - message.createdTimestamp;
                await message.channel.send(new MessageEmbed()
                    .setFooter(`Rendered for ${message.author.tag} in ${dur/1000} s`, message.author.avatarURL)
                    .setColor('#303136')
                    .attachFiles([new MessageAttachment(img, 'render.png')])
                    .setImage('attachment://render.png'));
            }
        }

        if (!message.flags[0])
            renderer(false);
        else if (message.flags.includes('t')
            || message.flags.includes('trans')
            || message.flags.includes('transparent'))
            renderer(true);
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'ADMIN'
    },
    help: {
        name: 'render',
        category: 'Utility',
        description: 'Renders some markdown or html for you.',
        usage: '//render ```markdown or html codeblock``` \n**Credits:** \n>  \`puf17640\` [Find them on github](https://github.com/puf17640 'puf17640 on github')',
        flags: [ '-t/-trans/-transparent => Render the final Image as transparent PNG.' ]
    },
}
