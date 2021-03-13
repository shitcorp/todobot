//const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');
const { todomodel } = require('../../modules/models/todomodel')
const messages = require('../../localization/messages.js');

exports.run = async (client, message, args, level) => {

    const conf = await client.getconfig(message.guild.id)
  
    const lang = conf.lang || "en";
    
    const parser = async (argarr) => {

        
        /**
         *  Supported keywords after "WHERE":
         *  => state= {open|assigned|closed}
         *  => severity= {1|2|3|4|5} [5 is lowest]
         *  => repeating= {true|false}
         *  => title= {"somestring"}
         *  => content= {"somestring"}
         *  => submittedby= {userid|usermention}
         *  => assigned= {userid|usermention}
         *  => category= {"somestring"}
         */


        console.log(argarr);
        let newind;
        if (argarr.includes("WHERE")) {
            newind = argarr.indexOf("WHERE");
            argind = newind + 1;
            
            if (!argarr[argind]) {
                return errormessage(messages.nosearchcriteria[lang])
            }
            
            let raw = argarr[newind]
            let arg = argarr[argind]
            let parsedarguments = arg.split("=")
            console.log(parsedarguments)

            switch(parsedarguments[0]) {
                case "state":
                case "severity":
                case "repeating":
                case "title":
                case "content":
                case "subittedby":
                case "assigned":
                case "category":
                    // we should use the value as regular expression for better results
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                default:
                    errormessage(messages.wrongqueryselector[lang])
                break;
            }

        }

    }
    
    
    
    const wherequery = async (argarr, key, val) => {

        let limit;

        const lastarg = argarr[argarr.length - 1]
        const patt = /([1-9])\w+/g
        const result = patt.test(lastarg)
    
        
        
        let obj = {
            guildid: message.guild.id
        }
        
        obj[key] = new RegExp(val);
        
        todomodel.find(obj, (err, docs) => {
            
            if (result) {
                if (parseInt(lastarg) > docs.length) limit = docs.length
                    else limit = parseInt(lastarg)
            } else {
                limit = docs.length
            }
            
            if (err) {
                errormessage(messages.databaseerror[lang])
            }

            if (!docs) return errormessage(messages.nothingfound[lang]);

            if (docs.length <= 0) {
                return errormessage(messages.nothingfound[lang]);
            }
           
            display(docs, limit)
        }, { limit: limit })
        
    }

    
    

    const display = async (TODOS, limit) => {

        console.log(limit)
        
        let arr = []
        
        for (let i = 0; i < limit; i++) {

            let todo = TODOS[i]
            //if (!todo) return;
            //if (!todo.title) return;

            let obj = {}

            todo.title ? obj.title = todo.title : obj.title = "empty";
            todo.content ? obj.content = todo.content : obj.content = "empty";
            todo.attachlink ? obj.attachment = todo.attachlink : obj.attachment = "empty";
            todo.category ? obj.category = todo.category : obj.category = "empty";
            todo.processed ? obj.processed = todo.processed : obj.processed = "empty";
            todo.state ? obj.state = todo.state : obj.state = "open";
            obj.timestamp = todo.timestamp;
        
            arr.push(obj)

        }

        

        /**
         * Web:
         * https://discord.com/channels/709541114633519177/710020770369110038/754594372791828521
         *                              {  GUILDID  }      {  CHANNEL  }      { MSG ID }
         * 
         * Client:
         * https://discordapp.com/channels/709541114633519177/710020973746716694/754719857001627740
         * 
         */


        const FieldsEmbed = new Pagination.FieldsEmbed()
            .setArray(arr)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(1)
            // Initial page on deploy
            .setPage(1)
            .setPageIndicator(true)
            .formatField('Title', i => i.title)
            .formatField('Content', i => i.content)
            .formatField('Attachements', i => i.attachment)
            .formatField('Processed', i => i.processed)
            .formatField('State', i => i.state)
            // Deletes the embed upon awaiting timeout
            .setDeleteOnTimeout(true)
            // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
            //.setDisabledNavigationEmojis(['delete'])
            // Set your own customised emojis
            .setFunctionEmojis({
                '🔄': (user, instance) => {

                    const dcbase = "https://discord.com/channels/"
                    const URL = dcbase + message.guild.id + "/" + conf.todochannel + "/" + TODOS[instance.page - 1].todomsg
                    message.channel.send(client.todo(TODOS[instance.page - 1]));
                    message.channel.send(client.embed(`[Original Message](${URL})`));
                    console.log(TODOS[instance.page - 1])
                },
                "✏️": async (user, i) => {

                },
                "❌": async (user, i) => {

                }
            })
            // Sets whether function emojis should be deployed after navigation emojis
            .setEmojisFunctionAfterNavigation(false);

        FieldsEmbed.embed
            .setColor("BLUE")
            .setFooter(`Manual:
✏️          Edit the TODO
❌          Delete the TODO
🔄          Repost the TODO
🗑️          Destroy this embed`);
       
    
        await FieldsEmbed.build();

        // Will not log until the instance finished awaiting user responses
        // (or techinically emitted either `expire` or `finish` event)
        console.log('done');





    }


    
    
    
    const todoquery = async () => {

        const todos = await client.getusertodos(message.author.id)

        let index = args.indexOf("TODOS")
        args.splice(index, 1);
        parser(args)
        

        //console.log(arr)

        


    }


    /**
     * Suggestions query handler here
     */

    const suggestionquery = async () => {
        let index = args.indexOf("T")
        args.splice(index, 1);
        parser(args)
    }

    const errormessage = async (text) => {
        message.channel.send(client.error(text))
    }




















    /**
     *  Command/Query Handler;
     *  Checks if the argument array includes one of the supported query keywords
     *  ( TODOS and SUGGESTIONS) and calls the according function or returns an 
     *  error message with some help on how to use the command. The rest of the 
     *  query parsing is done inside the individual functions.
     */

    args.includes("TODOS") ? todoquery() 
        : args.includes("T") ? suggestionquery() 
        : errormessage(`**This query is not supported at the moment.**\n\ 
        Supported query keywords are \`TODO\` and \`SUGGESTIONS\`. 
        Make sure the letters are all uppercase when trying again.
        For more information on how to use the query command, 
        run the command \`//manual query\`.`)







};



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "query",
    category: "TODO",
    description: "Query the database for your processed tasks.",
    usage: "query <YOUR QUERY>"
};