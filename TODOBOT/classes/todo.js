class todo {
    constructor(client, raw_todo) {
        this._id = raw_todo._id;
        this.guildid = raw_todo.guildid;
        this.title = raw_todo.title;
        this.content = raw_todo.content;
        this.tasks = raw_todo.tasks;
        this.attachlink = raw_todo.attachlink;
        this.submittedby = raw_todo.submittedby;
        this.timestamp = Date.now();
        this.time_started = raw_todo.time_started;
        this.time_finished = raw_todo.time_finished;
        this.state = raw_todo.state;
        this.severity = raw_todo.severity;
        this.loop = raw_todo.loop;
        this.shared = raw_todo.shared;
        this.todomsg = raw_todo.todomsg;
        this.todochannel = raw_todo.todochannel;
        this.readonlymessage = raw_todo.readonlymessage;
        this.readonlychannel = raw_todo.readonlychannel;
        this.assigned = raw_todo.assigned;
        this.category = raw_todo.category;

        // if this is given, we show an error inside of the todo embed;
        this.error = '';

        this.errordisplay = (message, user, error) => {
            this.error = error;
            client.clearReactions(message, user);
            message.edit(client.todo(this))
            setTimeout(async () => {
                this.error = '';
                client.clearReactions(message, user);
                message.edit(client.todo(this));
            }, 10000)
        }

    }
}

module.exports = todo;
