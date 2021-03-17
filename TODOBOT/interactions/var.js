module.exports = {
    id: '',
    name: 'var',
    conf: {
        enabled: true,
        permLevel: '',
    },
    help: {
        category: "Utility",
        description: "Set, view, edit and delete configvariables. Use them in your tags like so: <%foo%> to be replaced with the variable 'foo'",
        tutorial: {
            text: `__**Command Options**__
        //var -s/set foo bar => Saves a new key-value pair with the key foo and the value bar
        
        //var -v/view foo => Returns "bar", the value of foo
        
        //var -u/update/-e/edit foo newbar => Updates foo to the new value "newbar"
        
        //var -d/del foo => Deletes foo`,
            media: '',
        }
    },
    run: async (client, interaction) => {

        const conf = await client.getconfig(interaction.guild_id)
        if (!conf.vars) conf.vars = { "example": "This is an example variable" }
        const variableMap = await client.mapBuilder(conf.vars)

        const commandError = () => {
            return interactionhandler.embed.error(interaction, `**Something went wrong**
      Heres some info I gathered for you:
      
      __**Command Tutorial:**__
      
      ${client.interactions.get("var").help.tutorial}`)

        };

        let action, commandopts;
        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name;
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options) commandopts = interaction.data.options[index].options;
        }

        let name, value;
        for (i in commandopts) {
            if (commandopts[i].name === 'name') name = commandopts[i].value;
            if (commandopts[i].name === 'value') value = commandopts[i].value;
        }


        //use args for command
        switch (action) {
            // set a new key value pair
            case 'create':
                if (variableMap.get(name)) return interactionhandler.embed.error(interaction, `This key already exists.`)
                variableMap.set(name, encodeURI(value))
                conf.vars = variableMap;
                await client.updateconfig(interaction.guild_id, conf)
                interactionhandler.embed.success(interaction, `Saved your new configvariable with the key \`${name}\` and the value \`${value}\` `)
                break;
            // view key value pair by key (maybe add -all flag)
            case 'view':
                let output = '';
                Object.keys(conf.vars).forEach(key => {
                    output += `• \`${key}\` =>  ${conf.vars[key].slice(0, 69)} \n`;
                })
                interactionhandler.embed.default(interaction, `\n\n${output}`);
                break;
            // edit key value pair
            case 'edit':
                variableMap.set(name, encodeURI(value))
                conf.vars = variableMap;
                await client.updateconfig(interaction.guild_id, conf);
                interactionhandler.embed.success(interaction, `Updated the key \`${name}\` and saved the new value \`${value}\``)
                break;
            // delete key value pair by key
            case "delete":
                if (!variableMap.has(name)) return interactionhandler.embed.error(interaction, `You can only delete keys that exist`);
                variableMap.delete(name)
                conf.vars = variableMap;
                await client.updateconfig(interaction.guild_id, conf)
                interactionhandler.embed.success(interaction, `Deleted the key \`${args[1]}\``);
                break;
        }





    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    permLevel: "STAFF"
};