const messages = require('../localization/messages.js');

const raw = {
    name: "tag",
    description: "Bild your own commands like a pro.",
    options: [
        {
            name: "learn",
            description: 'Let the bot learn a new "command" or "tag".',
            // type 1 = subcommand
            // type 2 = subcommand group
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'The name of your new command/tag.',
                    // type 3 =  string
                    type: 3,
                    required: true,
                },
                {
                    name: 'content',
                    description: 'This is the content that will be sent when your custom command is run.',
                    type: 3,
                    required: true
                },
            ]

        },
        {
            name: 'unlearn',
            description: 'Delete a command.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'The command you want to delete.',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'edit',
            description: 'Edit an already existing tag.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'Name of the command you want to edit.',
                    type: 3,
                    required: true
                },
                {
                    name: 'content',
                    description: 'The content that you want to save as the new tag',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'List available tags.',
            type: 1
        }
    ]
}


module.exports = {
    raw,
    id: "",
    name: raw.name,
    conf: {
        enabled: true,
        premium: true,
        production: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {
        if (!interaction.data.options) return;
        const conf = interaction.conf;
        let lang = conf ? conf.lang ? conf.lang : 'en' : 'en';
        if (!conf) return interaction.errorDisplay(messages.addbottoguild[lang]);
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
                interaction.embed.default(`**` + messages.availabletags[lang] + `**` + `\n\n${output}`);
                break;
            case 'learn':
                if (client.commands.get(tag) || client.aliases.get(tag)) return interaction.errorDisplay(messages.cantoverwritecommands[lang]);
                if (tagMap.get(tag)) return interaction.errorDisplay(messages.tagalreadyexists[lang]);
                if (value.length > 1001) return interaction.errorDisplay(messages.descriptiontoolong[lang] + value.length)
                tagMap.set(tag, value);
                conf.tags = tagMap;
                await client.updateconfig(interaction.guild_id, conf);
                interaction.replyWithMessageAndDeleteAfterAWhile(client.success(messages.tagsaved[lang] + `\n\n> Tag:  \`${tag}\` \n\n> Description:  \`${value}\``))
                break;
            case 'unlearn':
                if (!tagMap.get(tag)) return interaction.errorDisplay(messages.tagdoesnotexist[lang])
                tagMap.delete(tag);
                conf.tags = tagMap;
                await client.updateconfig(interaction.guild_id, conf);
                interaction.embed.success(messages.tagunlearned[lang] + `\`${tag}\`.`)
                break;
            case 'edit':
                if (!tagMap.get(tag)) return interaction.errorDisplay(messages.tagdoesnotexist[lang]);
                if (value.length > 1001) return interaction.errorDisplay(messages.descriptiontoolong[lang] + value.length);
                tagMap.set(tag, value);
                conf.tags = tagMap;
                await client.updateconfig(interaction.guild_id, conf);
                interaction.replyWithMessageAndDeleteAfterAWhile(client.success(messages.tagsaved[lang] + `\n\n> Tag:  \`${tag}\` \n\n> Description:  \`${value}\``))
                break;
        }
    }
};