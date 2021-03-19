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

        this.assign = async (userid) => {
            this.assigned.push(userid);
            await client.updatetodo(this._id, this);
        }

    }
}

module.exports = todo;
