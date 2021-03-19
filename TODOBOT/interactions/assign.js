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
        console.log(interaction.data)
        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name;
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options) commandopts = interaction.data.options[index].options;
        }
    }
};
