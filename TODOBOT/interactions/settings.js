const messages = require("../localization/messages");

const raw = {
    name: 'settings',
    description: 'View and edit bot settings.',
    options: [
        {
            name: 'set',
            description: 'Set a new value',
            type: 1,
            options: [
                {
                    name: 'prefix',
                    description: 'The prefix the bot will use for your custom commands or tags.',
                    type: 3,
                    required: false
                },
                {
                    name: 'todochannel',
                    description: 'The channel that will be used to post your todos in.',
                    // type 7 = channel
                    type: 7,
                    required: false
                },
                {
                    name: 'readonlychannel',
                    description: 'The channel that will be used to keep your community updated.',
                    type: 7,
                    required: false
                },
                {
                    name: 'userrole',
                    description: 'Add a new userrole. Userroles can interact with the bot but cannot change bot settings.',
                    type: 8,
                    required: false
                },
                {
                    name: 'staffrole',
                    description: 'Add a new staffrole. Staffroles can edit bot settings and force assign users.',
                    type: 8,
                    required: false
                },
                {
                    name: 'language',
                    description: 'The language the bot uses to talk to you.',
                    type: 3,
                    required: false,
                    choices: [
                        {
                            name: 'english',
                            value: 'en'
                        },
                        {
                            name: 'german',
                            value: 'de'
                        }
                    ]
                },
                {
                    name: 'autopurge',
                    description: 'Toggle messages being auto purged in the todochannel.',
                    // BOOLEAN
                    type: 5,
                    required: false,
                }
            ]
        },
        {
            name: 'view',
            description: 'View your current settings.',
            type: 1
        },
        {
            name: 'remove',
            description: 'Remove a user or staffrole.',
            type: 1,
            options: [
                {
                    name: 'userrole',
                    description: 'Add a new userrole. Userroles can interact with the bot but cannot change bot settings.',
                    type: 8,
                    required: false
                },
                {
                    name: 'staffrole',
                    description: 'Add a new staffrole. Staffroles can edit bot settings and force assign users.',
                    type: 8,
                    required: false
                }
            ]
        }
    ]
};

module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        permLevel: 'STAFF',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {
  
        let action, commandopts;
        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name;
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options) commandopts = interaction.data.options[index].options;
        }

        let conf = await client.getconfig(interaction.guild_id);
        if (!conf) conf = {
            _id: interaction.guild_id,
            prefix: "//",
            color: "BLUE",
            todochannel: null,
            readonlychannel: null,
            staffroles: [],
            userroles: [],
            tags: new Map(),
            blacklist_channels: [],
            blacklist_users: [],
            vars: new Map(),
            lang: "en"
        }
        const lang = conf ? conf.lang ? conf.lang : 'en' : 'en';
        if (!action) return;
        switch (action) {
            case 'set':
                let staffrole, userrole
                for (i in commandopts) {
                    if (commandopts[i].name === 'prefix') conf.prefix = commandopts[i].value;
                    if (commandopts[i].name === 'todochannel') conf.todochannel = commandopts[i].value;
                    if (commandopts[i].name === 'readonlychannel') conf.readonlychannel = commandopts[i].value;
                    if (commandopts[i].name === 'staffrole') staffrole = commandopts[i].value;
                    if (commandopts[i].name === 'userrole') userrole = commandopts[i].value;
                    if (commandopts[i].name === 'language') conf.lang = commandopts[i].value;
                    if (commandopts[i].name === 'autopurge') conf.autopurge = commandopts[i].value;
                }
                if (staffrole) {
                    let staffroles = []
                    Object.values(conf.staffroles).forEach(value => staffroles.push(value));
                    staffroles.push(staffrole)
                    conf.staffroles = staffroles;
                }
                if (userrole) {
                    let userroles = []
                    Object.values(conf.userroles).forEach(value => userroles.push(value));
                    userroles.push(userrole)
                    conf.userroles = userroles;
                }
                try {
                    await client.setconfig(conf);
                } catch (e) {
                    await client.updateconfig(interaction.guild_id, conf);
                }
                interaction.replyWithMessageAndDeleteAfterAWhile(client.success(messages.savedsettings[lang]))
                break;
            case 'view':

                let output = {
                    prefix: conf.prefix,
                    todochannel: conf.todochannel,
                    readonlychannel: conf.readonlychannel,
                    userroles: conf.userroles,
                    staffroles: conf.staffroles,
                    language: conf.lang
                };

                let outputString = '**Current Settings** \n\n';
                
                for (i in output) {
                    switch (i) {
                        case 'readonlychannel':
                        case 'todochannel':
                            outputString += `> ${i}  =>  ${output[i] === undefined ? 'undefined' : await client.guilds.cache.get(interaction.guild_id).channels.fetch(output[i])} \n`
                            break;
                        case 'userroles':
                        case 'staffroles':
                            if (output[i] === [] || output[i] === '[]') outputString += `> ${i}  =>  \`${output[i] === undefined ? 'undefined' : output[i]}\` \n`
                            else {
                                let temp = [];
                                if (output[i]) output[i].forEach(async (role) => temp.push(`<@&${role}>`));
                                outputString += `> ${i}  =>  ${output[i] === undefined ? 'undefined' : temp.join(', ')} \n`
                            }
                            break;
                        default:
                            outputString += `> ${i}  =>  \`${output[i] === undefined ? 'undefined' : output[i]}\` \n`
                    }
                }

                const embedToSend = client.embed(outputString);
                embedToSend.setThumbnail(client.user.avatarURL());
                //cdn.discordapp.com/avatars/ user.id + user.avatar + .png
                embedToSend.setFooter(`Requested by ${interaction.member.user.username}#${interaction.member.user.discriminator}   •    www.todo-bot.xyz`, `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`)
                interaction.replyWithMessageAndDeleteAfterAWhile(embedToSend)
                
                break;
            case 'remove':
                let staffrole_to_remove, userrole_to_remove
                for (i in commandopts) {
                    if (commandopts[i].name === 'staffrole') staffrole_to_remove = commandopts[i].value;
                    if (commandopts[i].name === 'userrole') userrole_to_remove = commandopts[i].value;
                }
                if (staffrole_to_remove) {
                    let staffroles = []
                    Object.values(conf.staffroles).forEach(value => staffroles.push(value));
                    if (!staffroles.includes(staffrole_to_remove)) return interaction.errorDisplay(messages.rolenotinarray[lang]);
                    staffroles.splice(staffroles.indexOf(staffrole_to_remove), 1)
                    conf.staffroles = staffroles;
                }
                if (userrole_to_remove) {
                    let userroles = []
                    Object.values(conf.userroles).forEach(value => userroles.push(value));
                    if (!conf.userroles.includes(userrole_to_remove)) return interaction.errorDisplay(messages.rolenotinarray[lang]);
                    userroles.splice(userroles.indexOf(userrole_to_remove, 1))
                    conf.userroles = userroles;
                }
                try {
                    await client.setconfig(conf);
                } catch (e) {
                    await client.updateconfig(interaction.guild_id, conf);
                }
                interaction.replyWithMessageAndDeleteAfterAWhile(client.success(messages.savedsettings[lang]))
                break;
        }
    }

};