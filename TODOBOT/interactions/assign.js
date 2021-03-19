const todo = require('../classes/todo');

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
        permLevel: 'STAFF',
    },
    help: {
        category: 'System',
        description: raw.description
    },
    run: async (client, interaction) => {
        console.log(Object.values(interaction.data.resolved.users))
        // acknowledge the interaction
        interaction.reply(' ', 2)

        let user = Object.values(interaction.data.resolved.users)[0]

        if (user.bot === true) return interaction.channel.send(client.error('You cannot assign bots.'))
        
        let id;
        for (index in interaction.data.options) if (interaction.data.options[index].name === 'id') id = interaction.data.options[index].value;
        

        console.log(id)
        const check = await client.getonetodo(id);
        console.log(check)
        if (!check) return interaction.channel.send(client.error('This TODO does not seem to exist.'));


        const todoClass = new todo(client, check);

        // TODO: check if user already assigned
        if (todoClass.assigned.includes(user)) return interaction.channel.send(client.error('This user is alredy assigned.'))
        
        if (todoClass.state === 'open') todoClass.state = 'assigned';
        
        todoClass.assigned.push(user);
        
        await client.updatetodo(todoClass._id, todoClass)

        console.log(todoClass)

    }
};
