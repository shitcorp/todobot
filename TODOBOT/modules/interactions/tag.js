const messages = require('../../localization/messages.js');
const { configmodel } = require('../models/configmodel');

module.exports = {
    id: "",
    name: "tag",
    run: async (client, interaction) => {
        if (!interaction.data.options) return;
        const conf = await client.getconfig(interaction.guild_id)
        let lang = conf.lang ?  conf.lang : "en";
        if (!conf) return interactionhandler.embed.error(interaction, messages.addbottoguild[lang]);
        let action, commandopts;
        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name;
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options) commandopts = interaction.data.options[index].options;
        }
        if (!action) return;
        switch(action) {
            case 'list':
            let output = '';
            Object.keys(conf.tags).forEach(key => {
                output += `• \`${key}\` =>  ${conf.tags[key].slice(0, 69)} \n`;
            })
            interactionhandler.reply(interaction, messages.availabletags[lang] + `\n\n${output}`);
            break;
            case 'learn':

            break;
            case 'unlearn':

            break;
            case 'edit':

            break;
        }
        console.log(action, commandopts)
    } 
};