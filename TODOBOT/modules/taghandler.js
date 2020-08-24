module.exports = (client) => {
    client.taghandler = (message, tag) => {
        if (tag.includes("%%SENDDM%%") && message.mentions.users.first()) {
            try {
            message.mentions.users.first().send(client.embed(tag.replace("%%SENDDM%%", ""))).catch(e => { message.channel.send(client.error(`I couldnt send ${message.mentions.users.first()} a direct message.`)).then(msg => { msg.delete({ timeout: 60000}).catch(console.error) }) })
            } catch(e) {
              message.channel.send(client.error(`I couldnt send ${message.mentions.users.first()} a direct message.`)).then(msg => { msg.delete(60000).catch(console.error) })
            }
          } else if (tag.includes("%%REPLY%%")) {
            if (message.mentions.users.first()) {
              message.channel.send(message.mentions.users.first(), client.embed(tag.replace("%%REPLY%%", "")))
            } else {
              message.channel.send(message.author, client.embed(tag.replace("%%REPLY%%", "")))
            }
          } else {
            message.channel.send(client.embed(tag))
          }
    };
};