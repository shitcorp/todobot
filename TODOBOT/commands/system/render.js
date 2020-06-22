const converter = new (require('showdown')).Converter(),
imgMaker = require('node-html-to-image')
const { Attachment, RichEmbed } = require('discord.js');



exports.run = async (client, message, args, level) => {


async function renderer(boolean) {

    if (args[0].includes('```md') || args[0].includes('```html')) {
        const markdown = message.content.split('\n').splice(1).join('\n').replace(/`{3}.*/g, '').trim()
        const html = converter.makeHtml(markdown)
        const img = await imgMaker({ html, transparent: boolean, puppeteerArgs: ['--no-sandbox'] })
        let dur = Date.now() - message.createdTimestamp
        let mdr = new RichEmbed()
          .setFooter(`Rendered for ${message.author.tag} in ${dur/1000} s`, message.author.avatarURL)
          .setColor('#303136')
          .attachFiles([new Attachment(img, 'render.png')])
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
    permLevel: "User"
};

exports.help = {
    name: "render",
    category: "System",
    description: "Renders some markdown or html for you.",
    usage: "render ```markdown or html codeblock```"
};