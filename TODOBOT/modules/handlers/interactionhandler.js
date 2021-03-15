const
    { Colors } = require('../util/colors');


module.exports = (client) => {

    
    


    global.interactionhandler.reply = async (interaction, msg, type = 4) => {
        return client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type,
                data: {
                    content: msg
                }
            }
        })
    };


    global.interactionhandler.embed = {
        default: async (interaction, description, type = 4, color = "BLURPLE") => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type, 
                    data: {
                        embeds: [
                            {
                                description,
                                color: Colors[color]
                            }
                        ]
                    }
                }
                    
            }) 
        },
        success: async (interaction, description, type = 3, color = "GREEN") => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type,
                    data: {
                        embeds: [
                            {
                                title: "✅ Success!",
                                description,
                                color: Colors[color]
                            }
                        ]
                    }
                }
            })
        },
        error: async(interaction, description, type = 4, color = "RED") => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type,
                    data: {
                        embeds: [
                            {
                                title: "❌ Error",
                                description,
                                color: Colors[color]
                            }
                        ]
                    }
                }
            }) 
        }
    };

    

};