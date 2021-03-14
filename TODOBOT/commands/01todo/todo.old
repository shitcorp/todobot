const messages = require('../../localization/messages')

exports.run = async (client, message, args) => {
    
    
    const uniqid = require('uniqid'); 
    
    const msgdel = client.config.msgdelete
    const guildconf = await client.getconfig(message.guild.id);
    
    const lang = guildconf.lang || "en";

    if (!guildconf) return message.channel.send(client.warning(messages.noguildconfig[lang])).then(msg => {
        msg.delete({ timeout: msgdel }).catch(error => { console.error(error) })
    });


    let todoobj = {
        state: "open"
    }

    

    async function quicksave() {
        
        
        /**
         *  Idea: First persists => title
         *        Second persist => content
         *        Third persist  => Screenshot/Attachlink
         *        Fourth persist => Category
         * 
         *  Note: Make it possible to pass in lets say only
         *        a title and the category wherevery you want
         * 
         */
        
        todoobj.title = message.persists[0]

        if (message.persists.includes("loop")) {
            todoobj.loop = true;
            message.persists.splice(message.persists.indexOf("loop"))
        } else {
            todoobj.loop = false;
        }

        const index = message.persists.findIndex(value => /^category=/i.test(value));
        if (index > -1) {
            var cache = message.persists[index].replace(/^category=/i, "")
            todoobj.category = cache;
            message.persists[3] = cache;
            message.persists[index] = "";
        }
        message.persists[1] ? todoobj.content = message.persists[1] : todoobj.content = null;
        message.persists[2] ? todoobj.attachlink = message.persists[2]: todoobj.attachlink = null;
        message.persists[3] ? todoobj.category = message.persists[3] : todoobj.category = null;
        
        
        saverboi(todoobj);
        
    };

    async function saverboi(todoobj) {

        let chan = message.guild.channels.cache.get(guildconf.todochannel)
        if (!chan) return message.channel.send(client.error("There seems to be a problem with your todo channel. At least I couldnt find it. Check your settings with 'systemctl -s settings'"));
        let msg = await chan.send(client.todo(todoobj))
        if (!msg) return message.channel.send(client.error(messages.unabletoposttodo[lang]))
        let sanitizedobjet = {
            _id: uniqid(),
            guildid: message.guild.id,
            title: todoobj.title,
            content: todoobj.content,
            attachlink: todoobj.attachlink,
            submittedby: message.author.id,
            timestamp: Date.now(),
            severity: 5,
            state: "open",
            loop: todoobj.loop,
            todomsg: msg.id,
            assigned: [],
            category: todoobj.category
        };
        
        await client.settodo(sanitizedobjet);
        await msg.react("✏️")
        await msg.react("📌")
        await message.channel.send(messages.todoposted[lang])
    }

    // TODO: make function that asks questions and returns todo object
    
    message.persists[0] ? quicksave() 
    : longsave(todoobj)



    async function longsave (todoobj) {
        
        const argStringtoParse = args.join(" ")
        if (argStringtoParse.includes(" // ")) parsed = argStringtoParse.split(" // ")
            else if (argStringtoParse.includes(";")) parsed = argStringtoParse.split("; ")
                else parsed = args;

        //console.log(parsed)

        if (parsed[0]) todoobj.title = parsed[0] 
            else return message.channel.send(client.error(messages.emptytitle[lang]))
        
        if (parsed.includes("loop")) {
            todoobj.loop = true;
            parsed.splice(parsed.indexOf("loop"), 1);
        } else {
            todoobj.loop = false;
        }
        
        
        const index = parsed.findIndex(value => /^category=/i.test(value));
        if (index > -1) {
            var cache = parsed[index].replace(/^category=/i, "");
            parsed[index] = "";
            todoobj.category = cache
            parsed[3] = cache;
        }
        
       
        
       
        parsed[1] ? todoobj.content = parsed[1] : todoobj.content = null;
        parsed[2] ? todoobj.attachlink = parsed[2] : todoobj.attachlink = null;
        parsed[3] ? todoobj.category = parsed[3] : todoobj.category = null;
        saverboi(todoobj);

    }


}



exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['t'],
    permLevel: "STAFF"
};

exports.help = {
    name: "todo",
    category: "TODO",
    description: "Submit a new TODO.",
    usage: `//**todo** title // content // attachment // [loop]
    > 
    >  OR
    > 
    > //**todo** title; content; attachment; [loop]` 


};