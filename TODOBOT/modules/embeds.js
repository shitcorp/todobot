const { MessageEmbed } = require("discord.js");

module.exports = (client) => {



    client.noPerms = (perms) => {
        const noPerm = new MessageEmbed()
            .setAuthor('❌ No Permissions')
            .setDescription(`You lack the permission \`${perms.toUpperCase()}\` to use this command!`)
            .setColor("RED")
        return noPerm;
    }



    client.embed = (desc) => {
        const embed = new MessageEmbed()
            .setDescription(`${desc}`)
            .setColor("#2C2F33")
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

    client.todo = (todoobj) => {
        console.log(todoobj.state)

        

        

        let embed = new MessageEmbed()
            .setDescription(`**${todoobj.title}**`)
            .setColor("RED")
            todoobj.content ? embed.addField("Content:", todoobj.content) : null;
            todoobj.attachlink ? embed.addField("Attachements:", todoobj.attachlink) : null;
            todoobj.category ? embed.addField("Category:", todoobj.category) : null;


        return embed;
    }




}