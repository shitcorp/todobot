const message = require('../events/message'),
    Config = require('./models/configmodel')

module.exports = async () => {
    Config.find({ _id: message.guild.id }).then(res => {
        if (!res[0] || !res[0].suggestchannel) return;
        message.guild.channels.get(res[0].suggestchannel).messages.fetch();
    });
};
