const message = require('../../events/message');

async function suggestionscheck() {


    const { configmodel } = require('../models/configmodel')

    configmodel.find({ _id: message.guild.id }).then(res => {
        if (!res[0]) return;
        if (!res[0].suggestchannel) return;
        const chan = message.guild.channels.get(res[0].suggestchannel)
        chan.messages.fetch()
    })




}

module.exports = { suggestionscheck };