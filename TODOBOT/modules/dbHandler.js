const SQLite = require('better-sqlite3'),
    sql = new SQLite('./data/data.sqlite');

module.exports = (client) => ({
    ...client,
    createTodo: ({ guild }) => {
        const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = '${guild.id}-todo';`).get();
        if (!table['count(*)']) {
            sql.prepare(`CREATE TABLE '${guild.id}-todo'(guildId TEXT, guildspecificindex INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, bugid TEXT UNIQUE, bugtitle TEXT, bugrecreation TEXT, screenshoturl TEXT, submittedby TEXT, timestamp TEXT, state TEXT, bugmsg TEXT, assigned TEXT);`).run()
            sql.pragma('synchronous = 1');
            sql.pragma('journal_mode = wal');
            client.logger.dba(`[DATA ADD] The guildspecific todotable '${guild.id}-todo' was created by ${guild.name}`)
        }
    },
    createConfig: () => {
        const config = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'config';`).get();
        if (!config['count(*)']) {
            sql.prepare(`CREATE TABLE 'config'(guildId INTEGER PRIMARY KEY UNIQUE, prefix TEXT, color TEXT, staffrole TEXT, todochannel TEXT);`).run()
            sql.pragma('synchronous = 1');
            sql.pragma('journal_mode = wal');
            client.logger.dba(`[DATA ADD] The database table 'config' was created.`)
        }
    },
    getTodos: ({ guild: { id }}) => sql.prepare(`SELECT * FROM '${id}-todo';`).all(),
    getTodoByMsg: ({ guild: { id }}, bugmsg) => sql.prepare(`SELECT * FROM '${id}-todo' WHERE bugmsg=?;`).all(bugmsg.id),
    getTodoById: ({ guild }, id) => sql.prepare(`SELECT * FROM '${guild.id}-todo' WHERE bugid=?;`).all(id),
    getConfig: ({ guild: { id }}) => sql.prepare(`SELECT * FROM 'config' WHERE guildId=?;`).all(id),
    setTodo:({ guild }, obj) => {
        sql.prepare(`INSERT INTO '${guild.id}-todo' (guildId, bugid, bugtitle, bugrecreation, screenshoturl, submittedby, timestamp, state, bugmsg, assigned) VALUES (@guildId, @bugid, @bugtitle, @bugrecreation, @screenshoturl, @submittedby, @timestamp, @state, @bugmsg, @assigned)`).run(obj)
        client.logger.dba(`[DATA ADD] '${guild.name}' (ID: ${guild.id}) added the TODO '${obj.bugTitle}'(ID: ${obj.bugId}) to the database`)
    },
    updateTodo: (message, key, value, id) => {
        try {
            sql.prepare(`UPDATE '${message.guild.id}-todo' SET ${key}='${value}' WHERE bugid=?;`).run(id)
        } catch (e) {
            client.discordLog(e, message, 'UPDATE METHOD DB HANDLER')
        }
    },
    updateConfig: ({ guild: { id }}, key, value) => sql.prepare(`UPDATE 'config' SET ${key}='${value}' WHERE guildId=?`).run(id),
    setConfig: (obj) => sql.prepare(`INSERT OR REPLACE INTO 'config' (guildId, prefix, color, staffrole, todochannel) VALUES(@guildId, @prefix, @color, @staffrole, @todochannel)`).run(obj),
    deleteTodo: ({ guild }, id) => sql.prepare(`DELETE FROM '${guild.id}-todo' WHERE bugid=?;`).run(id)
});