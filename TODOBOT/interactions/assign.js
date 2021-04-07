const todo = require('../classes/todo');
const messages = require('../localization/messages');

const raw = {
    name: 'assign',
    description: 'Assign someone to a task no matter if they want or not.',
    options: [
        {
            name: 'user',
            description: 'The user you want to assign.',
            // type 6 = user
            type: 6,
            required: true
        },
        {
            name: 'id',
            description: 'ID of the task that you want to assing the user to.',
            type: 3,
            required: true
        }
    ]
}

module.exports = {
    raw,
    id: '822581844213366876',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'System',
        description: raw.description
    },
    run: async (client, interaction) => {
        // acknowledge the interaction

        if (!interaction.conf) return interaction.errorDisplay(messages.addbottoguild['en'])
        let lang = interaction.conf ? interaction.conf.lang ? interaction.conf.lang : 'en' : 'en';

        let user = Object.values(interaction.data.resolved.users)[0]

        if (user.bot === true) return interaction.errorDisplay(messages.cannotassignbots[lang]);
        
        let id;
        for (index in interaction.data.options) if (interaction.data.options[index].name === 'id') id = interaction.data.options[index].value;
        
        const check = await client.getonetodo(id);

        if (!check) return interaction.errorDisplay(messages.tododoesntexist[lang]);

        const todoClass = new todo(client, check);

        if (todoClass.assigned.includes(user.id)) return interaction.errorDisplay(messages.useralreadyassigned[lang]);
        
        if (todoClass.state === 'open') todoClass.state = 'assigned';
        
        todoClass.assigned.push(user.id);
        
        await client.updatetodo(todoClass._id, todoClass)

        let todochannel = await client.guilds.cache.get(interaction.guild_id).channels.cache.get(todoClass.todochannel);
        let msg = await todochannel.messages.fetch(todoClass.todomsg);

        await msg.edit(client.todo(todoClass))
        interaction.replyWithMessageAndDeleteAfterAWhile(client.success('User assigned.'));

    }
};
