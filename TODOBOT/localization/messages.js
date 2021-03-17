/**
 * @file message.js
 * @fileoverview Messages in different languages for the bot to use
 * @description 
 * Usage:
 * Add your language with the valid language abbreviation and translate
 * the sentence. I ususally edit this file in a Code Editor like VS-Code,
 * so I can see when theres a formatting error. What also helps, is when
 * you add a new language, like lets say french, do it as follows:
 * 
 * "something": {
 *      "en": "...",
 *      "de": "...",
 *      "fr": ""
 * }
 * 
 * Add the comma after the last language, then put your language abbreviation,
 * in quotation marks,  a colon right after, then empty quotation marks. This
 * ensures that you do everything correctly and dont have to worry about any
 * formatting mistakes.
 * 
 * 
 */


module.exports = {
    
    // modules/handlers/interactionhandler.js
    "todonoargs": {
        "en": "You must at least submit a title for your task.",
        "de": "Du musst zumindest einen Titel für deine Aufgabe angeben."
    },
    
    // modules/handlers/interactionhandler.js; commands/01todo/todo.js
    "todoposted": {
        "en": "Great! Your TODO has been posted. React with 📌 to assign it to yourself and when you're done, react with ✅ to close the TODO.",
        "de": "Super! Deine neue Aufgabe wurde gepostet, Reagiere mit 📌 um die Aufgabe anzunehmen und mit ✅ wenn du fertig mit der Aufgabe bist."
    },
    
    // modules/handlers/interactionhandler.js
    "addbottoguild": {
        "en": "Please add the bot to your guild in order to use this command. Available slash commands are: \`/shoten\`",
        "de": "Der Bot muss Mitglied deines Servers sein um diesen Command benutzen zu können. Verfügbare Slash Commands sind: \`/shorten\`"
    },
    
    // modules/handlers/interactionhandler.js
    "emptytitle": {
        "en": "Empty titles are not allowed!",
        "de": "Leere titel sind nicht erlaubt!"
    },
    
    // commands/01todo/query.js
    "nothingfound": {
        "en": "There was nothing found matching your search criteria.",
        "de": "Wir konnten nichts finden, dass deinem Suchkriterium entsprach."
    },
    
    // commands/01todo/query.js
    "databaseerror": {
        "en": "Something went wrong when trying to query the database.",
        "de": "Es ist ein Fehler beim Durchsuchen der Datenbank aufgetreten"
    },

    // commands/01todo/query.js
    "nosearchcriteria": {
        "en": "You didnt give any search criteria afer the \`WHERE\` keyword.",
        "de": "Du hast vergessen einen Suchbegriff nach dem \`WHERE\` einzugeben."
    },
    
    // commands/01todo//query.js    
    "wrongqueryselector": {
        "en": "This is not a valid query selector. Run `//help query` for more information on how to use the query command.",
        "de": ""
    },

    // commands/01todo/todo.js
    "noguildconfig": {
        "en": "I couldn't find any configuration file for this guild. If you just added the bot, run the setup command.",
        "de": ""
    },

    // modules/handlers/interactionhandler.js; commands/01todo/todo.js
    "unabletoposttodo": {
        "en": "I was unable to post your todo. Please make sure I have the permission to read and write in your desired todo channel. Also make sure you have set a channel where I should post the tasks. If not run the //setup command",
        "de": "Ich konnte deine Aufgabe leider nicht posten. Stelle bitte sicher, dass ich die benötigten Berechtigungen habe, um in deinem TODO-Channel Nachrichten zu lesen und zu schreiben. Hast du vielleicht vergessen, einen Channel festzulegen, in dem ich deine Aufgaben posten soll? Falls ja, lege ihn jetzt mit dem //setup command fest."
    },

    // todo-interaction
    "only10tasksallowed": {
        "en": "Only 10 tasks are allowed, so i capped your task list at 10.",
        "de": "Es sind maximal 10 Aufgaben erlaubt, deshalb wurde deine TODO-Liste bei 10 Elementen gecappt."
    },

    // commands/02utility/learn.js
    "forgottag": {
        "en": "You forgot to give a tag to learn.",
        "de": "Du hast vergessen, einen Tag zum Lernen anzugeben."
    },

    // commands/02utility/learn.js
    "forgotdescription": {
        "en": "You forgot to give a description for your tag.",
        "de": "Du hast vergessen eine Beschreibung für deinen Tag anzugeben."
    },

    // commands/02utility/learn.js
    "cantoverwritecommands": {
        "en": "You cant override bot commands or aliases with tags.",
        "de": "Du kannst Bot Commands oder ihre Aliase nicht mit Tags überschreiben"
    },

    // commands/02utility/learn.js
    "tagalreadyexists": {
        "en": "This tag already exists, unlearn it first before overwriting..",
        "de": "Dieser Tag existiert bereits, lösche ihn zuerst (//unlearn).."
    },
    
    // commands/02utility/learn.js
    "descriptiontoolong": {
        "en": "Your description was too long. From \`1000\` available characters you used: ",
        "de": "Deine Beschreibung war zu lang. Von \`1000\` verfügbaren Zeichen hast du benutzt: "
    },

    // commands/02utility/learn.js
    "tagsaved": {
        "en": "Saved the new tag for you. Summary: ",
        "de": "Dein neuer Tag wurde gespeichert. Zusammenfassung: "
    },

    // commands/02utility/unlearn.js
    "forgottagtounlearn": {
        "en": "You forgot to give a tag to unlearn.",
        "de": "Du hast vergessen, einen Tag um Löschen anzugeben."
    },

    // commands/02utility/unlearn.js
    "tagdoesnotexist": {
        "en": "This tag does not seem to exist.",
        "de": "Dieser Tag scheint nicht zu existieren."
    },

    // commands/02utility/unlearn.js
    "tagunlearned": {
        "en": "Unlearned the tag: ",
        "de": "Folgender Tag wurde gelöscht: "
    },

    // commands/02utility/tags | commands/02utility/systemctl
    "tagnoconfigfound": {
        "en": "I didn't find any configuration for your guild. Try to run the //setup command",
        "de": ""
    },

    // modules/interactions/shorten.js
    "nolinkgiven": {
        "en": "You forgot to enter a link to shorten.",
        "de": "Du hast vergessen einen Link zum verkürzen einzugeben."
    },

    // modules/interactions/shorten.js
    "backendoffline": {
        "en": "The backend seems to be offline. Maybe try again later?... \n\nIf the problem persists please contact the developers on discord or open an issue on [Github](https://github.com/MeerBiene/TODOBOT)",
        "de": ""
    },

    // modules/interactions/shorten.js
    "somethingwentwrong": {
        "en": "Something went wrong while trying to fetch your link",
        "de": ""
    },

    // modules/interactions/shorten.js
    "notacceptablelink": {
        "en": "The link you want to shorten does not seem to be acceptable.",
        "de": ""
    },

    // modules/interactions/shorten.js
    "toomanyrequests": {
        "en": "Too many requests, try again later.",
        "de": ""
    },

    // modules/interactions/shorten.js
    "shortenedurl": {
        "en": "Heres your shortened URL. Keep in mind that it expires in 24 hours. \n",
        "de": "Hier ist dein Kurzlink. Denk dran dass der Link in 24 Stunden gelöscht wird. \n"
    },

    // events/messageReactionAdd.js
    "editReactionUsage": {
        "en": `
        __**Usage:**__

        Enter the key you want to edit followed by the new value seperated by a comma and a space. **The space after the comma is important and not optional!**

        __**Examples:**__

        > title, this is the new title

        > content, this is my new content

        > loop, true

        > state, open

        > category, important
        `,
        "de": ``
    },

    // tag interaction
    "availabletags": {
        "en": "Available Tags: ",
        "de": "Verfügbare Tags: "
    },

    // blacklist interaction
    'useralreadyblacklisted': {
        'en': 'This user is already blacklisted.',
        'de': 'Dieser User ist bereits auf der Blacklist'
    },

    // blacklist interaction
    'updatedyourblacklist': {
        'en': 'Updated your blacklist.',
        'de': 'Deine neue Blacklist wurde gespeichert.'
    },

    // blacklist interaction
    'channelalreadyblacklisted': {
        'en': 'This channel is already blacklisted.',
        'de': 'Dieser channel ist bereits auf der blacklist.'
    }

}