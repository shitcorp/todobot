const { RichEmbed } = require("discord.js");

module.exports = (client) => {



    client.noPerms = (perms) => {
        const noPerm = new RichEmbed()
            .setAuthor('❌ No Permissions')
            .setDescription(`You lack the permission \`${perms.toUpperCase()}\` to use this command!`)
            .setColor("RED")
        return noPerm;
    }



    client.embed = (desc) => {
        const embed = new RichEmbed()
            .setDescription("```" + `${desc}` + "```")
            .setColor("#2C2F33")
        return embed;
        
    }


    client.error = (desc) => {

        const erre = new RichEmbed()
            .setAuthor('❌ Error')
            .setDescription(`${desc}`)
            .setColor("RED")
        return erre;

    }


    client.warning = (desc) => {

        const warne = new RichEmbed()
            .setAuthor(`⚠️ Warning`)
            .setDescription(`${desc}`)
            .setColor("#fffb0a")
        return warne

    }

    client.success = (desc) => {

        const successe = new RichEmbed()
            .setAuthor(`✅ Success!`)
            .setDescription(`${desc}`)
            .setColor("GREEN")
        return successe

    }




}