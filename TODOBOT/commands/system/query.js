//const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');

exports.run = async (client, message, args, level) => {

  
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
            console.log(argarr[newind], argarr[argind])
        }

    }
    
    
    
    
    
    
    
    
    const todoquery = async () => {

        const todos = await client.getusertodos(message.author.id)

        let arr = []
        todos.forEach(todo => {
            if (!todo.title) return;
            let obj = {}

            todo.title ? obj.title = todo.title : "None";
            todo.content ? obj.content = todo.content : obj.content = "empty";
            todo.attachlink ? obj.attachment = todo.attachlink : obj.attachment = "empty";
            todo.category ? obj.category = todo.category : obj.category = "emtpy";
            todo.processed ? obj.processed = todo.processed : obj.processed = "None";
            todo.state ? obj.state = todo.state : obj.state = "open";
            arr.push(obj)
        })

        //console.log(arr)

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
                    const field = instance.embed.fields[0];
                    console.log(instance.page)
                    console.log(todos[instance.page])
                    message.channel.send(client.todo(todos[instance.page - 1]));
                }
            })
            // Sets whether function emojis should be deployed after navigation emojis
            .setEmojisFunctionAfterNavigation(false);

        FieldsEmbed.embed
            .setColor(0xFF00AE)
            .setDescription('Test Description');

        await FieldsEmbed.build();

        // Will not log until the instance finished awaiting user responses
        // (or techinically emitted either `expire` or `finish` event)
        console.log('done');


    }


    /**
     * Suggestions query handler here
     */

    const suggestionquery = async () => {
        let index = args.indexOf("SUGGESTIONS")
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
        : args.includes("SUGGESTIONS") ? suggestionquery() 
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

exports.manual = (message) => {

}