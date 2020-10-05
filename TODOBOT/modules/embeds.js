const { MessageEmbed } = require('discord.js'),
    { format } = require('date-fns');

module.exports = (client) => ({
    ...client,
    noPerms: (perms) => new MessageEmbed().setAuthor('❌ No Permissions')
        .setDescription(`You lack the permission \`${perms.toUpperCase()}\` to use this command!`).setColor('RED'),
    embed: (desc, obj) => {
        const embed = new MessageEmbed().setDescription(`${desc}`).setColor(obj.color || '#2C2F33')
        if (obj && obj.img && obj.img.startsWith('https://cdn.discordapp.com/attachments/') 
            || obj && obj.img && obj.img.startsWith('https://img.todo-bot.xyz/')) 
            embed.setImage(img)
        if (obj && obj.thumb && obj.thumb.startsWith('https://cdn.discordapp.com/attachments/') 
            || obj && obj.thumb && obj.thumb.startsWith('https://img.todo-bot.xyz/')) 
            embed.setThumbnail(thumb)
        return embed;
    },
    coloredEmbed: (desc, color) => new MessageEmbed().setDescription(`${desc}`).setColor(color),
    error: (desc) => new MessageEmbed().setAuthor('❌ Error').setDescription(`${desc}`).setColor('RED'),
    warning: (desc) => new MessageEmbed().setAuthor(`⚠️ Warning`).setDescription(`${desc}`).setColor('#fffb0a'),
    success: (desc) => new MessageEmbed().setAuthor(`✅ Success!`).setDescription(`${desc}`).setColor('GREEN'),
    todo: (todoObj, isDetail) => {
        // TODO: make a field for assigned users
        // TODO: put manual in footer (different manuals based on todos state!)
        let embed = new MessageEmbed().setDescription(`**${todoObj.title}**`)
  
        if(todoObj.content) 
            embed.addField('Content', `> ${todoObj.content}`);
        if(todoObj.attachlink) {
            if (todoObj.attachlink.startsWith('https://cdn.discordapp.com/attachments/') 
                || todoObj.attachlink.startsWith('https://img.todo-bot.xyz/')) {
                embed.setImage(todoObj.attachlink)
            } else embed.addField('Attachments', todoObj.attachlink)
        }
        if(todoObj.category) 
            embed.addField('Category', todoObj.category, true);

        if (todoObj.assigned && todoObj.assigned !== []) {
            const output = Object.keys(todoObj.assigned).map(key => `<@${todoObj.assigned[key]}> \n`).join('')
            if(output !== '' && todoObj.state === 'assigned')
                embed.addField('Assigned', output, true);
        }

        switch (todoObj.state) {
            case 'open':
                embed.setColor('RED')
                embed.setFooter(`____________________________
✏️          Edit the TODO at hand.
📌          Assign yourself to the task.`)
                break;
            case 'assigned':
                embed.setColor('YELLOW')
                embed.setFooter(`____________________________
✏️          Edit the TODO at hand.
✅          Mark the task as finished.
                ➕          Add yourself to assigned users. `)
                break;
            case 'closed':
                embed.setColor('GREEN')
                embed.setFooter(`__________________________
⬇️               Show more details.`)
                break;
            case 'detail':
                embed.setColor('GREEN')
                embed.setFooter(`__________________________
⬆️               Show less details.`)
                break;
            default:
                embed.setColor('YELLOW')
        }


        if (isDetail && todoObj.assigned !== []) {
            const output = Object.keys(todoObj.assigned).forEach(key => `<@${todoObj.assigned[key]}> \n`).join('')
            if(output !== '')
                embed.addField('Processed', output, true);
            
            embed.addField('Submitted By', client.users.cache.get(todoObj.submittedby), true)
            embed.addField('Submitting Time', `> ${format(parseInt(todoObj.timestamp), 'PPpp')}`, true)
            embed.addField('Severity', todoObj.severity, true)
            embed.addField('Loop', todoObj.loop, true)
            embed.addField('ID', `> ${todoObj._id}`, true)
        }
        return embed;
    },
    reminder: (reminder) => new MessageEmbed().setTitle(`⚠️  Your Reminder!  ⚠️`).setDescription(`
            \`\`\`${reminder.content}\`\`\`
            `).setColor('YELLOW')
});
