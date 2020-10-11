const { exec } = require('child_process'), 
    { format } = require('date-fns'),
    fs = require('fs');

module.exports = {
    run: async (client, message, args) => {
        await client.user.setActivity(`Applying an update!`, { type: 2, browser: 'DISCORD IOS' });
        exec('git pull', async (err, out, stderr) => {
            if(!err){
                message.channel.send(client.embed(out));
                const msg = await message.channel.send(client.embed('Loading . . . . '));
                const formatted = format(Date.now(), `EEEE yyyy/MM/dd H:m`);
                const update = {
                    applied: false,
                    requested: message.author.tag,
                    requested_id: message.author.id,
                    channel: message.channel.id,
                    msg: message.id,
                    time: formatted,
                    output: out,
                    errors: err,
                    stderr: stderr
                };
                fs.writeFileSync(`update.json`, JSON.stringify(update));
                await msg.edit(client.embed(`Restarting . . . `));
                exec('pm2 restart TODO2', async (err, _out, stderr) => {
                    if(err && stderr !== '')
                        return await message.channel.send(client.error(`${err} \n ${stderr}`));
                    return await message.channel.send(client.success(`Update was pulled and applied.`));
                })
            } else
                await message.channel.send(client.embed(`${out} \n\n ${stderr}`));
        });
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'root'
    },
    help: {
        name: 'update',
        category: 'System',
        description: 'Pulls the latest changes from github.',
        usage: 'update'
    }
};
