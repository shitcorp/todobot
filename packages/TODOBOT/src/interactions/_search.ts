import MyClient from '../classes/Client'
import Interaction from '../classes/Interaction'

const raw = {
    name: 'search',
    description: 'Search for specific todos.',
    options: [
        {
            name: 'submitting_user',
            description: 'Search for a certain submitting user.',
            type: 6,
            required: false,
        },
        {
            name: 'assigned_user',
            description: 'Search for a certain assigned user.',
            type: 6,
            required: false,
        },
        {
            name: 'title',
            description: 'Search for a certain title.',
            type: 3,
            required: false,
        },
        {
            name: 'category',
            description: 'Search for all tasks in a certain category.',
            type: 3,
            required: false,
        },
        {
            name: 'content',
            description: 'Search for taks with a certain content.',
            type: 3,
            required: false,
        },
        {
            name: 'state',
            description: 'Search for all tasks with a certain state.',
            type: 3,
            required: false,
            choices: [
                {
                    name: 'open',
                    value: 'open',
                },
                {
                    name: 'assigned',
                    value: 'assigned',
                },
                {
                    name: 'closed',
                    value: 'closed',
                },
            ],
        },
    ],
}

export default {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: false,
        premium: false,
        production: false,
        // USER - BOT_USER - STAFF
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description,
    },
    run: async (client: MyClient, interaction: Interaction) => {
        // eslint-disable-next-line no-console
        console.log(interaction.conf)
    },
}
