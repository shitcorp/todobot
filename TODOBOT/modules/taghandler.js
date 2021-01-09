module.exports = (client) => {
  client.taghandler = async (message, tag) => {
    
    const conf = await client.getconfig(message.guild.id)
    console.log(conf.vars)

    const getJoinRank = (ID, guild) => { // Call it with the ID of the user and the guild
      if (!guild.member(ID)) return; // It will return undefined if the ID is not valid

      let arr = guild.members.cache.array(); // Create an array with every member
      let test = guild.members.cache.get(message.author.id)
      //console.log(test)
      arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort them by join date

      for (let i = 0; i < arr.length; i++) { // Loop though every element
        if (arr[i].id == ID) return i; // When you find the user, return it's position
      }
    }

    const JOIN_POS = async () => {
      return getJoinRank(message.author.id, message.guild)
    }

    const MEMCOUNT = async () => {
      return message.guild.memberCount
    }

    const PROCESSED = async () => {
      const howMany = await client.getprocessedtodos(message.author.id)
      return howMany.length
    }

    const SUBMITTED = async () => {
      const submitted = client.getusertodos(message.author.id)
      return submitted.length
    }

    const MSG_AUTHOR = async () => {
      return message.author;
    }

    const MSG_AUTHOR_ID = async () => {
      return message.author.id;
    }

    const MSG_AUTHOR_TAG = async () => {
      return message.author.tag;
    }

    const MSG_AUTHOR_NAME = async () => {
      return message.author.username;
    }

    const GUILD_NAME = async () => {
      return message.guild.name;
    }


    
    const PLACEHOLDERS = {
      "<JOIN_POS>": JOIN_POS,
      "<MEMCOUNT>": MEMCOUNT,
      "<PROCESSED>": PROCESSED,
      "<SUBMITTED>": SUBMITTED,
      "<MSG_AUTHOR>": MSG_AUTHOR,
      "<MSG_AUTHOR_ID>": MSG_AUTHOR_ID,
      "<MSG_AUTHOR_TAG>": MSG_AUTHOR_TAG,
      "<MSG_AUTHOR_NAME>": MSG_AUTHOR_NAME,
      "<GUILD_NAME>": GUILD_NAME
      
    }


    /**
     * 
     * @param {*} tag 
     * turns the key of the placeholder into
     * a RegExp and replaces it with the value
     * 
     */

    const regexHandler = async (tag) => {
      for (let key in PLACEHOLDERS) {
        let value = await PLACEHOLDERS[key]()
        tag = tag.replace(new RegExp(key, "gi"), value)
      }
      return tag;
    }

    const embedhandler = async (tag) => {
      let cont = tag.replace("<EMBED>", "").replace("</EMBED>", "")
      let obj = {}

      if (tag.includes("<COLOR>")) {
        let temp = cont.split(" ")
        let index = temp.indexOf("<COLOR>")
        let endindex = temp.indexOf("</COLOR>")
        obj.color = temp[endindex -index]
        temp.splice(index, 3)
        cont = temp.join(" ")
      }

      if (tag.includes("<IMG>")) {
        let temp = cont.split(" ")
        let index = temp.indexOf("<IMG>")
        let endindex = temp.indexOf("</IMG>")
        obj.img = temp[endindex -index]
        temp.splice(index, 3)
        cont = temp.join(" ")
      }

      if (tag.includes("<THUMB>")) {
        let temp = cont.split(" ")
        let index = temp.indexOf("<THUMB>")
        let endindex = temp.indexOf("</THUMB>")
        obj.thumb = temp[endindex -index]
        temp.splice(index, 3)
        cont = temp.join(" ")
      }

      let parsed = await regexHandler(cont)
      message.channel.send(client.embed(parsed, obj))
    }



    /**
     * Real taghandling happens down here.
     * Basically just seperate between the tags
     * that include <EMBED> or some other function
     * keywords that are no variables
     */
    tag.includes("<EMBED>") || tag.includes("</EMBED>") ? embedhandler(tag) 
      : message.channel.send(await regexHandler(tag))


      
    };
};
