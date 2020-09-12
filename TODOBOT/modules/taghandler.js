const { differenceInCalendarQuarters } = require("date-fns");

module.exports = (client) => {
  client.taghandler = (message, tag) => {



    const getJoinRank = (ID, guild) => { // Call it with the ID of the user and the guild
      if (!guild.member(ID)) return; // It will return undefined if the ID is not valid

      let arr = guild.members.cache.array(); // Create an array with every member
      arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort them by join date

      for (let i = 0; i < arr.length; i++) { // Loop though every element
        if (arr[i].id == ID) return i; // When you find the user, return it's position
      }
    }

    var donethestuff;
    
    const handler = (value, key, map) => {
      //sconsole.log(tag.includes(key), key)
      if (tag.includes(key)) {
        
          value(tag)
        
      } else {
        if (!donethestuff) {
          donethestuff = true;
          send(tag)
        }
        
      } 
      
    }

    const send = async (tag) => { 
      // if (!donethestuff) {
      //   donethestuff = true;
         message.channel.send(tag)
      // }
    }


    const JOIN_POS = async (tag) => {
      message.channel.send(tag.replace("<JOIN_POS>", getJoinRank(message.author.id, message.guild)))
    }

    const REPLY = async (tag) => {
      message.mentions.users.first() ? message.channel.send(tag.replace("<REPLY>", message.mentions.users.first())) :
        message.channel.send(tag.replace("<REPLY>", ""))
    }

    const MEMCOUNT = async (tag) => {
      message.channel.send(tag.replace("<MEMCOUNT>", message.guild.memberCount))
    }

    const PROCESSED = async (tag) => {
      const test = await client.getusertodos(message.author.id)
      console.log(test)
    }

    const EMBED = (tag) => {
      const toparse = tag.split(" ")
      const color = toparse[toparse.indexOf("</COLOR>") - toparse.indexOf("<COLOR>")]
      toparse.splice(toparse.indexOf("</COLOR>") - toparse.indexOf("<COLOR>"), 1)
      tag = toparse.join(" ")
      message.channel.send(client.coloredEmbed(tag.replace("<EMBED>", "").replace("<COLOR>", "").replace("</COLOR>", ""), color))
    }



    new Map([
      ['<JOIN_POS>', JOIN_POS],
      ['<MEMCOUNT>', MEMCOUNT],
      ['<PROCESSED>', PROCESSED],
      ['<EMBED>', EMBED],
      ['<REPLY>', REPLY]
    ]).forEach(handler);







    // if (tag.includes("%%SENDDM%%") && message.mentions.users.first()) {
    //   try {
    //     message.mentions.users.first().send(client.embed(tag.replace("%%SENDDM%%", ""))).catch(e => { message.channel.send(client.error(`I couldnt send ${message.mentions.users.first()} a direct message.`)).then(msg => { msg.delete({ timeout: 60000 }).catch(console.error) }) })
    //   } catch (e) {
    //     message.channel.send(client.error(`I couldnt send ${message.mentions.users.first()} a direct message.`)).then(msg => { msg.delete(60000).catch(console.error) })
    //   }
    // } else if (tag.includes("%%REPLY%%")) {
    //   if (message.mentions.users.first()) {
    //     message.channel.send(message.mentions.users.first(), client.embed(tag.replace("%%REPLY%%", "")))
    //   } else {
    //     message.channel.send(message.author, client.embed(tag.replace("%%REPLY%%", "")))
    //   }
    // } else if (tag.includes("<MEMCOUNT>")) {

    //   message.channel.send(tag.replace("<MEMCOUNT>", message.guild.memberCount))

    // } else if (tag.includes("<JOIN_POS>")) {
    //   message.channel.send(tag.replace("<JOIN_POS>", getJoinRank(message.author.id, message.guild)))
    // } else {
    //   message.channel.send(client.embed(tag))
    // }
  };
};