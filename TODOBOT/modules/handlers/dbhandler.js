const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/data.sqlite');


module.exports = (client) => {




    client.dbcreatetodo = (message) => {

        const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = '${message.guild.id}-todo';`).get();

        if (!table['count(*)']) {
            sql.prepare(`CREATE TABLE '${message.guild.id}-todo'(guildid TEXT, guildspecificindex INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, bugid TEXT UNIQUE, bugtitle TEXT, bugrecreation TEXT, screenshoturl TEXT, submittedby TEXT, timestamp TEXT, state TEXT, bugmsg TEXT, assigned TEXT);`).run()
            sql.pragma("synchronous = 1");
            sql.pragma("journal_mode = wal");
            client.logger.dba(`[DATA ADD] The guildspecific todotable '${message.guild.id}-todo' was created by ${message.guild.name}`)

        }
    }


    client.dbcreateconfig = () => {

        const config = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'config';`).get();
        if (!config['count(*)']) {
            sql.prepare(`CREATE TABLE 'config'(guildid INTEGER PRIMARY KEY UNIQUE, prefix TEXT, color TEXT, staffrole TEXT, todochannel TEXT);`).run()
            sql.pragma("synchronous = 1");
            sql.pragma("journal_mode = wal");
            client.logger.dba(`[DATA ADD] The database table 'config' was created.`)

        }

    }


    client.dbgettodoall = (message) => {

        return sql.prepare(`SELECT * FROM '${message.guild.id}-todo';`).all()

    }


    client.dbgettodoonemsg = (message, bugmsg) => {

        return sql.prepare(`SELECT * FROM '${message.guild.id}-todo' WHERE bugmsg=?;`).all(bugmsg.id)

    }


    client.dbgettodooneid = (message, ID) => {

        return sql.prepare(`SELECT * FROM '${message.guild.id}-todo' WHERE bugid=?;`).all(ID)
        
    }


    client.dbgetconfig = (message) => {

        return sql.prepare(`SELECT * FROM 'config' WHERE guildid=?;`).all(message.guild.id)

    }


    client.dbsettodoobject = (message, obj) => {

        sql.prepare(`INSERT INTO '${message.guild.id}-todo' (guildid, bugid, bugtitle, bugrecreation, screenshoturl, submittedby, timestamp, state, bugmsg, assigned) VALUES (@guildid, @bugid, @bugtitle, @bugrecreation, @screenshoturl, @submittedby, @timestamp, @state, @bugmsg, @assigned)`).run(obj)
        client.logger.dba(`[DATA ADD] '${message.guild.name}' (ID: ${message.guild.id}) added the TODO '${obj.bugtitle}'(ID: ${obj.bugid}) to the database`)

    }


    client.dbupdatetodo = (message, key, value, ID) => {

        try {
            sql.prepare(`UPDATE '${message.guild.id}-todo' SET ${key}='${value}' WHERE bugid=?;`).run(ID)
        } catch (e) {
            client.discordlog(e, message, "UPDATE METHOD DB HANDLER")
        }

    }

    client.dbupdateconfig = (message, key, value) => {

        sql.prepare(`UPDATE 'config' SET ${key}='${value}' WHERE guildid=?`).run(message.guild.id)

    }


    client.dbsetconfigobject = (message, object) => {

        sql.prepare(`INSERT OR REPLACE INTO 'config' (guildid, prefix, color, staffrole, todochannel) VALUES(@guildid, @prefix, @color, @staffrole, @todochannel)`).run(object)

    }

    client.dbdeletetodo = (message, ID) => {

        sql.prepare(`DELETE FROM '${message.guild.id}-todo' WHERE bugid=?;`).run(ID)

    }



}