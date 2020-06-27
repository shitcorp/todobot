exports.run = async (client, message, args, level) => {

    // imports
    const { remindermodel } = require('../../modules/models/remindermodel')
    const uniqid = require('uniqid');

    //Handler
    switch(message.flags[0]) {
        case "v":
            reminderviewer()
        break;
        case "c":
            remindercreator()
        break;
        case "rm":
            reminderdeletor()
        break;
    }

    // Functions
    async function reminderviewer() {
        console.log(uniqid('reminderid-'))
    }

    async function remindercreator() {

    }

    async function reminderdeletor() {

    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "STAFF"
};

exports.help = {
    name: "reminder",
    category: "System",
    description: "Create, view and delete reminders.",
    usage: "reminder -v => View all your current reminders. \n> reminder -c -1h Food! => Create a reminder in 1h from now.\n> reminder -rm -ID => Delete the reminder with the given ID.",
    flags: ['-v => View all your reminders.', '-c => Create a new reminder.', '-rm => Remove/delete the given reminder.']
};