const fetch = require('node-fetch'),
    FileType = require('file-type'),
    { URL, TOKEN } = require('../../data/image.url.json');

module.exports = {
    run: async (client, message, _args, _level) => {
        const timeout = process.env.MSG_DELETE_TRESHHOLD;

        if (message.attachments.size < 1) 
            return message.channel.send(client.error(`You forgot to attach an image`))
                .then((msg) => { 
                    if (message.deletable) message.delete();
                    if (msg.deletable) msg.delete({ timeout });
                });
        message.attachments.forEach(async (attachment) => {
            const resp = await fetch(attachment.url, { method: 'GET' });
            let body = Buffer.from(await resp.buffer());
            let file = await FileType.fromBuffer(body);
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': TOKEN,
                    'Content-Type': file.mime
                },
                body
            }).json();
            await message.channel.send(client.success(`Heres your link: ${URL}${response.filename}`))
                .then(async (_msg) => message.deletable && await message.delete());
        });
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: ['u'],
        permLevel: 'User'
    },
    help: {
        name: 'upload',
        category: 'Utility',
        description: 'Uploads the attached image to an image server and sends you the link.',
        usage: '//upload <IMAGE>'
    }
}
