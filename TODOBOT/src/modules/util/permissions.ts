export default (client) =>
    client.decorate('permMap', {
        USER: 0,
        BOT_USER: 1,
        STAFF: 2,
    })
