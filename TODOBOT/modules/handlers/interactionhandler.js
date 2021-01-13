const messages = require('../../localization/messages.js');
const todocmd = require('../interactions/todo');


module.exports = (client) => {    


    global.interactionhandler = async (interaction) => {

        // refactor, load all interactions in map
        // on init with id => run(), then check
        // name on execution
        switch(interaction.data.name) {
            case "todo":
            todocmd.run(client, interaction);
            break;
        };
        client.logger.cmd(`Received the interaction ${interaction.data.name}`)
    };

    
    global.interactionhandler.errorMsg = async (interaction, msg) => {
        return client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    embeds: [
                        {
                            title: "Error",
                            description: msg,
                            color: 420
                        }
                    ]
                }
            }
        })
    };

    global.interactionhandler.reply = async (interaction, msg) => {
        return client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: msg
                }
            }
        })
    };
    

};