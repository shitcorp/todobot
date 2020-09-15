const converter = new (require('showdown')).Converter(),
imgMaker = require('node-html-to-image')
const { MessageAttachment, MessageEmbed } = require('discord.js');



exports.run = async (client, message, args, level) => {


async function renderer(boolean) {

    if (args[0].includes('```md')) {
        
        let puppeteerArgs = {
            args: ['--no-sandbox']
        }
        
        const markdown = message.content.split('\n').splice(1).join('\n').replace(/`{3}.*/g, '').trim()
        const html = converter.makeHtml(markdown)
        const img = await imgMaker({ 
            html, 
            transparent: boolean, 
            puppeteerArgs
        })
        let dur = Date.now() - message.createdTimestamp
        let mdr = new MessageEmbed()
          .setFooter(`Rendered for ${message.author.tag} in ${dur/1000} s`, message.author.avatarURL)
          .setColor('#303136')
          .attachFiles([new MessageAttachment(img, 'render.png')])
          .setImage('attachment://render.png')
          
        let emsg = await message.channel.send(mdr)
      } else if (args[0].includes('```html')) {
        
        if (message.author.id !== "686669011601326281") return;
        
        let puppeteerArgs = {
            args: ['--no-sandbox']
        }
        
        const markdown = message.content.split('\n').splice(1).join('\n').replace(/`{3}.*/g, '').trim()
        const html = converter.makeHtml(markdown)
        const img = await imgMaker({ 
            html, 
            transparent: boolean, 
            puppeteerArgs
        })
        let dur = Date.now() - message.createdTimestamp
        let mdr = new MessageEmbed()
          .setFooter(`Rendered for ${message.author.tag} in ${dur/1000} s`, message.author.avatarURL)
          .setColor('#303136')
          .attachFiles([new MessageAttachment(img, 'render.png')])
          .setImage('attachment://render.png')
          
        let emsg = await message.channel.send(mdr)
      }

}



if (!message.flags[0]) {

    renderer(false);

} else if (message.flags.includes("t") || message.flags.includes("trans") || message.flags.includes("transparent")) {

    renderer(true);

}

}



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "ADMIN"
};

exports.help = {
    name: "render",
    category: "Utility",
    description: "Renders some markdown or html for you.",
    usage: '//render ```markdown or html codeblock``` \n**Credits:** \n>  \`puf17640\` [Find them on github](https://github.com/puf17640 "puf17640 on github")',
    flags: [ '-t/-trans/-transparent => Render the final Image as transparent PNG.' ]
};