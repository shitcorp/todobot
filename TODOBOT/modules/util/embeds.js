const { MessageEmbed } = require("discord.js-light");
const { format } = require("date-fns");

module.exports = (client) => {



    client.noPerms = (perms) => {
        const noPerm = new MessageEmbed()
            .setAuthor('❌ No Permissions')
            .setDescription(`You lack the permission \`${perms.toUpperCase()}\` to use this command!`)
            .setColor("RED")
        return noPerm;
    }



    client.embed = (desc, obj) => {
        const embed = new MessageEmbed()
            .setDescription(`${desc}`)
            .setColor("#2C2F33")
        if (obj && obj.color) embed.setColor(obj.color)
        if (obj && obj.img && obj.img.startsWith("https://cdn.discordapp.com/attachments/") || obj && obj.img && obj.img.startsWith("https://img.todo-bot.xyz/")) embed.setImage(img)
        if (obj && obj.thumb && obj.thumb.startsWith("https://cdn.discordapp.com/attachments/") || obj && obj.thumb && obj.thumb.startsWith("https://img.todo-bot.xyz/")) embed.setThumbnail(thumb)
        return embed;

    }

    client.coloredEmbed = (desc, color) => {
        const embed = new MessageEmbed()
            .setDescription(`${desc}`)
            .setColor(color)
        return embed;
    }


    client.error = (desc) => {

        const errorEmbed = new MessageEmbed()
            .setAuthor('❌ Error', client.user.avatarURL)
            .setDescription(`${desc}`)
            .setColor("RED")
        return errorEmbed;

    }


    client.warning = (desc) => {

        const warne = new MessageEmbed()
            .setAuthor(`⚠️ Warning`)
            .setDescription(`${desc}`)
            .setColor("#fffb0a")
        return warne

    }

    client.success = (desc) => {

        const successe = new MessageEmbed()
            .setAuthor(`✅ Success!`)
            .setDescription(`${desc}`)
            .setColor("GREEN")
        return successe

    }


    // TODO: make a field for assigned users
    // TODO: put manual in footer (different manuals based on todos state!)
    client.todo = (todoobj, detailbool) => {

        const embed = new MessageEmbed()
            .setDescription(`**${todoobj.title}**`)

        const attacher = () => {
            if (todoobj.attachlink.startsWith("https://cdn.discordapp.com/attachments/") || todoobj.attachlink.startsWith("https://img.todo-bot.xyz/")) {
                embed.setImage(todoobj.attachlink)
            } else {
                embed.addField("Attachments", todoobj.attachlink)
            }
        }

        if (todoobj.tasks && todoobj.tasks.length > 0) {
            let output = '';
            let count = 0;
            let prograssBar = [];
            for (let i = 0; i < todoobj.tasks.length; i++) {
                output += `${todoobj.tasks[i].includes('finished_') ? '<:checksquareregular:820384679562838046> ' + todoobj.tasks[i].replace('finished_', '') : '<:squareregular:820381667881517118> ' + todoobj.tasks[i]} \n`
                if (todoobj.tasks[i].includes('finished_')) {
                    count++
                    prograssBar.push(client.emojiMap['+']);
                } else {
                    prograssBar.push(client.emojiMap['-']);
                };
            }

            embed.addField(`Tasks (${count} / ${todoobj.tasks.length}): \n ${prograssBar.join('')}`, `${output}`)
        }

        if (todoobj.content) embed.addField("Content", `> ${todoobj.content}`);
        if (todoobj.category) embed.addField("Category", todoobj.category, true);
        if (todoobj.attachlink) attacher();

        if (todoobj.assigned) {
            let output = '';
            if (todoobj.assigned !== []) {
                Object.keys(todoobj.assigned).forEach(key => {
                    output += `<@${todoobj.assigned[key]}> \n`
                })
                if (output !== '' && todoobj.state === 'assigned') embed.addField('Assigned', output, true);
            }
        }






        switch (todoobj.state) {
            case "open":
                embed.setColor("RED")
                if (todoobj.readonly !== '.') embed.setFooter(`${todoobj._id}`)
                break;
            case "assigned":
                embed.setColor("YELLOW")
                if (todoobj.readonly !== '.') embed.setFooter(`${todoobj._id}`)
                break;
            case "closed":
                embed.setColor("GREEN")

                break;
            case "detail":
                embed.setColor("GREEN")
                break;
            case "readonly":
                embed.setColor("BLUE")
                break;
            default:
                embed.setColor("YELLOW")
        }

       
        
        
        if (detailbool) {
            let output = "";

            if (todoobj.assigned !== []) {
                Object.keys(todoobj.assigned).forEach(key => {
                    output += `<@${todoobj.assigned[key]}> \n`
                })
                output !== "" ? embed.addField("Processed", output, true) : null;
            }

            embed.addField("Submitted By", `<@${todoobj.submittedby}>`, true)
            embed.addField("Submitting Time", `> ${format(parseInt(todoobj.timestamp), "PPpp")}`, true)
            embed.addField("Severity", todoobj.severity, true)
            embed.addField("Loop", todoobj.loop, true)
            embed.addField("ID", `> ${todoobj._id}`, true)

        }
        
        if (todoobj.error && todoobj.error !== '') {
            embed.addField('Error', '```' + todoobj.error + '```')
            embed.setColor('RED')
        }
        return embed;

    };



    client.reminder = (reminderobj) => {
        let embed = new MessageEmbed()
            .setTitle(`⚠️  Your Reminder!  ⚠️`)
            .setDescription(`
            \`\`\`${reminderobj.content}\`\`\`
            `)
            .setColor("YELLOW")
        return embed
    }



}