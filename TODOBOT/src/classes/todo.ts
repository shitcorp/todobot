class todo {
    _id: any
    client: any
    guildid: any
    title: any
    content: any
    tasks: any
    attachlink: any
    submittedby: any
    timestamp: any
    time_started: any
    time_finished: any
    state: any
    severity: any
    loop: any
    shared: any
    todomsg: any
    todochannel: any
    readonlymessage: any
    readonlychannel: any
    assigned: any
    category: any
    error: string
    // eslint-disable-next-line camelcase
    constructor(client, raw_todo) {
        this._id = raw_todo._id
        this.client = client
        // this.guild = client.guilds.fetch(raw_todo.guildid);
        this.guildid = raw_todo.guildid
        this.title = raw_todo.title
        this.content = raw_todo.content
        this.tasks = raw_todo.tasks
        this.attachlink = raw_todo.attachlink
        this.submittedby = raw_todo.submittedby
        this.timestamp = raw_todo.timestamp
        this.time_started = raw_todo.time_started
        this.time_finished = raw_todo.time_finished
        this.state = raw_todo.state
        this.severity = raw_todo.severity
        this.loop = raw_todo.loop
        this.shared = raw_todo.shared
        this.todomsg = raw_todo.todomsg
        // this.channel = client.channels.fetch(raw_todo.todochannel)
        this.todochannel = raw_todo.todochannel
        this.readonlymessage = raw_todo.readonlymessage
        this.readonlychannel = raw_todo.readonlychannel
        this.assigned = raw_todo.assigned
        this.category = raw_todo.category
        // if this is given, we show an error inside of the todo embed;
        this.error = ''
    }

    errordisplay(message, user, error) {
        this.error = error
        this.client.clearReactions(message, user)
        message.edit(this.client.todo(this))
        setTimeout(async () => {
            this.error = ''
            this.client.clearReactions(message, user)
            message.edit(this.client.todo(this))
        }, 10000)
    }

    assign(user) {
        this.assigned.push(user)
    }
}

export default todo
