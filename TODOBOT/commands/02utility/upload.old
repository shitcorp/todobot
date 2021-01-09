const fetch = require("node-fetch")
const FileType = require('file-type');
const { URL, TOKEN } = require("../../data/image.url.json")

exports.run = async (client, message, args, level) => {

    const timeout =client.config.msgdelete

    if (message.attachments.size < 1) return message.channel.send(client.error(`
    You forgot to attach an image`)).then((msg) => { 
        if (message.deletable) message.delete()
        if (msg.deletable) msg.delete({ timeout })
     })

    message.attachments.forEach(async attachment => {

        const resp = await fetch(attachment.url, {
            method: "GET"
        })

        let buff = await resp.buffer()
        let body = Buffer.from(buff)
        let CT = await FileType.fromBuffer(body);

        const post = await fetch(URL, {
            method: "POST",
            headers: {
                "Authorization": TOKEN,
                "Content-Type": CT.mime
            },
            body
        })

        const response = await post.json()
        message.channel.send(client.success(`
        Heres your link: ${URL}${response.filename}
        `)).then(msg => {
            if (message.deletable) message.delete()
        })

    })


};



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: ["u"],
    permLevel: "User"
};

exports.help = {
    name: "upload",
    category: "Utility",
    description: "Uploads the attached image to an image server and sends you the link.",
    usage: "//upload <IMAGE>"
};   