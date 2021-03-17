const messages = require('../localization/messages.js');

module.exports = {
    id: "",
    name: "tag",
    run: async (client, interaction) => {
        if (!interaction.data.options) return;
        const conf = await client.getconfig(interaction.guild_id)
        let lang = conf.lang ? conf.lang : "en";
        if (!conf) return interactionhandler.embed.error(interaction, messages.addbottoguild[lang]);
        let action, commandopts;
        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name;
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options) commandopts = interaction.data.options[index].options;
        }
        if (!action) return;
        const tagMap = await mapBuilder(conf.tags)
        let tag, value;
        if (commandopts) {
            for (i in commandopts) {
                if (commandopts[i].name === 'name') tag = commandopts[i].value;
                if (commandopts[i].name === 'content') value = commandopts[i].value;
            }
        }
        switch (action) {
            case 'list':
                let output = '';
                Object.keys(conf.tags).forEach(key => {
                    output += `• \`${key}\` =>  ${conf.tags[key].slice(0, 69)} \n`;
                })
                interactionhandler.embed.default(interaction, messages.availabletags[lang] + `\n\n${output}`);
                break;
            case 'learn':
                if (client.commands.get(tag) || client.aliases.get(tag)) return interactionhandler.embed.error(interaction, messages.cantoverwritecommands[lang]);
                if (tagMap.get(tag)) return interactionhandler.embed.error(interaction, messages.tagalreadyexists[lang]);
                if (value.length > 1001) return interactionhandler.embed.error(interaction, messages.descriptiontoolong[lang] + value.length)
                tagMap.set(tag, value);
                conf.tags = tagMap;
                await client.updateconfig(interaction.guild_id, conf);
                interactionhandler.embed.success(interaction, messages.tagsaved[lang] + `\n\n> Tag:  \`${tag}\` \n\n> Description:  \`${value}\``)
                break;
            case 'unlearn':
                if (!tagMap.get(tag)) return interactionhandler.embed.error(interaction, messages.tagdoesnotexist[lang])
                tagMap.delete(tag);
                conf.tags = tagMap;
                await client.updateconfig(interaction.guild_id, conf);
                interactionhandler.embed.success(interaction, messages.tagunlearned[lang] + `\`${tag}\`.`)
                break;
            case 'edit':
                if (!tagMap.get(tag)) return interactionhandler.embed.error(interaction, messages.tagdoesnotexist[lang]);
                if (value.length > 1001) return interactionhandler.embed.error(interaction, messages.descriptiontoolong[lang] + value.length);
                tagMap.set(tag, value);
                conf.tags = tagMap;
                await client.updateconfig(interaction.guild_id, conf);
                interactionhandler.embed.success(interaction, messages.tagsaved[lang] + `\n\n> Tag:  \`${tag}\` \n\n> Description:  \`${value}\``)
                break;
        }
    }
};