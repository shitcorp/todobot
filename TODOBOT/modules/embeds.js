const { MessageEmbed } = require("discord.js");
const { format } = require("date-fns");

module.exports = (client) => {



    client.noPerms = (perms) => {
        const noPerm = new MessageEmbed()
            .setAuthor('❌ No Permissions')
            .setDescription(`You lack the permission \`${perms.toUpperCase()}\` to use this command!`)
            .setColor("RED")
        return noPerm;
    }



    client.embed = (desc, {color, img, thumb}) => {
        const embed = new MessageEmbed()
            .setDescription(`${desc}`)
            .setColor("#2C2F33")
        if (color) embed.setColor(color)
        if (img && img.startsWith("https://cdn.discordapp.com/attachments/") || img && img.startsWith("https://img.todo-bot.xyz/")) embed.setImage(img)
        if (thumb && thumb.startsWith("https://cdn.discordapp.com/attachments/") || thumb && thumb.startsWith("https://img.todo-bot.xyz/")) embed.setThumbnail(thumb)
        return embed;

    }

    client.coloredEmbed = (desc, color) => {
        const embed = new MessageEmbed()
            .setDescription(`${desc}`)
            .setColor(color)
        return embed;
    }


    client.error = (desc) => {

        const erre = new MessageEmbed()
            .setAuthor('❌ Error')
            .setDescription(`${desc}`)
            .setColor("RED")
        return erre;

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

        let embed = new MessageEmbed()
            .setDescription(`**${todoobj.title}**`)

        const attacher = () => {
            if (todoobj.attachlink.startsWith("https://cdn.discordapp.com/attachments/") || todoobj.attachlink.startsWith("https://img.todo-bot.xyz/")) {
                embed.setImage(todoobj.attachlink)
            } else {
                embed.addField("Attachments", todoobj.attachlink)
            }
        }


        todoobj.content ? embed.addField("Content", `> ${todoobj.content}`) : null;
        todoobj.attachlink ? attacher() : null;
        todoobj.category ? embed.addField("Category", todoobj.category, true) : null;

        let output = "";
            if (todoobj.assigned !== []) {
                Object.keys(todoobj.assigned).forEach(key => {
                    output += `<@${todoobj.assigned[key]}> \n`
                })
                output !== "" && todoobj.state === "assigned" ? embed.addField("Assigned", output, true) : null;
            }




        switch (todoobj.state) {
            case "open":
                embed.setColor("RED")
                embed.setFooter(`____________________________
✏️          Edit the TODO at hand.
📌          Assign yourself to the task.`)
                break;
            case "assigned":
                embed.setColor("YELLOW")
                embed.setFooter(`____________________________
✏️          Edit the TODO at hand.
✅          Mark the task as finished.
                ➕          Add yourself to assigned users. `)
                break;
            case "closed":
                embed.setColor("GREEN")
                embed.setFooter(`__________________________
⬇️               Show more details.`)
                break;
            case "detail":
                embed.setColor("GREEN")
                embed.setFooter(`__________________________
⬆️               Show less details.`)
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
            
            embed.addField("Submitted By", client.users.cache.get(todoobj.submittedby), true)
            embed.addField("Submitting Time", `> ${format(parseInt(todoobj.timestamp), "PPpp")}`, true)
            embed.addField("Severity", todoobj.severity, true)
            embed.addField("Loop", todoobj.loop, true)
            embed.addField("ID", `> ${todoobj._id}`, true)

        }
        return embed;
    }



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