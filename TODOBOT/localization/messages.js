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
 */

module.exports = {
    
    // interactionhandler.js
    "todonoargs": {
        "en": "You must at least submit a title for your task.",
        "de": "Du musst zumindest einen Titel für deine Aufgabe angeben."
    },
    
    // interactionhandler.js; todo.js
    "todoposted": {
        "en": "Great! Your TODO has been posted. React with 📌 to assign it to yourself and when you're done, react with ✅ to close the TODO.",
        "de": "Super! Deine neue Aufgabe wurde gepostet, Reagiere mit 📌 um die Aufgabe anzunehmen und mit ✅ wenn du fertig mit der Aufgabe bist."
    },
    
    // interactionhandler.js
    "addbottoguild": {
        "en": "Please add the bot to your guild in order to use this command. Available slash commands are: \`/shoten\`",
        "de": "Der Bot muss Mitglied deines Servers sein um diesen Command benutzen zu können. Verfügbare Slash Commands sind: \`/shorten\`"
    },
    
    // interactionhandler.js
    "emptytitle": {
        "en": "Empty titles are not allowed!",
        "de": "Leere titel sind nicht erlaubt!"
    },
    
    // query.js
    "nothingfound": {
        "en": "There was nothing found matching your search criteria.",
        "de": "Wir konnten nichts finden, dass deinem Suchkriterium entsprach."
    },
    
    // query.js
    "databaseerror": {
        "en": "Something went wrong when trying to query the database.",
        "de": "Es ist ein Fehler beim Durchsuchen der Datenbank aufgetreten"
    },

    // query.js
    "nosearchcriteria": {
        "en": "You didnt give any search criteria afer the \`WHERE\` keyword.",
        "de": "Du hast vergessen einen Suchbegriff nach dem \`WHERE\` einzugeben."
    },
    
    // query.js    
    "wrongqueryselector": {
        "en": "This is not a valid query selector. Run `//help query` for more information on how to use the query command.",
        "de": ""
    },

    // todo.js
    "noguildconfig": {
        "en": "I couldn't find any configuration file for this guild. If you just added the bot, run the setup command.",
        "de": ""
    },

    // interactionhandler.js; todo.js
    "unabletoposttodo": {
        "en": "I was unable to post your todo. Please make sure I have the permission to read and write in your desired todo channel. Also make sure you have set a channel where I should post the tasks. If not run the //setup command",
        "de": "Ich konnte deine Aufgabe leider nicht posten. Stelle bitte sicher, dass ich die benötigten Berechtigungen habe, um in deinem TODO-Channel Nachrichten zu lesen und zu schreiben. Hast du vielleicht vergessen, einen Channel festzulegen, in dem ich deine Aufgaben posten soll? Falls ja, lege ihn jetzt mit dem //setup command fest."
    },

    // learn.js
    "forgottag": {
        "en": "You forgot to give a tag to learn.",
        "de": "Du hast vergessen, einen Tag zum Lernen anzugeben."
    },

    // learn.js
    "forgotdescription": {
        "en": "You forgot to give a description for your tag.",
        "de": "Du hast vergessen eine Beschreibung für deinen Tag anzugeben."
    },

    // learn.js
    "cantoverwritecommands": {
        "en": "You cant override bot commands or aliases with tags.",
        "de": "Du kannst Bot Commands oder ihre Aliase nicht mit Tags überschreiben"
    },

    // learn.js
    "tagalreadyexists": {
        "en": "This tag already exists, unlearn it first before overwriting, or use this command with the \`-force\` flag.",
        "de": "Dieser Tag existiert bereits, lösche ihn erst (//unlearn) oder benutze diesen Command erneut mit der \`-force\` flag."
    },
    
    // learn.js
    "descriptiontoolong": {
        "en": "Your description was too long. From \`1000\` available characters you used: ",
        "de": "Deine Beschreibung war zu lang. Von \`1000\` verfügbaren Zeichen hast du benutzt: "
    },

    //learn.js
    "tagsaved": {
        "en": "Saved the new tag for you. Summary: ",
        "de": "Dein neuer Tag wurde gespeichert. Zusammenfassung: "
    },

    // unlearn.js
    "forgottagtounlearn": {
        "en": "You forgot to give a tag to unlearn.",
        "de": "Du hast vergessen, einen Tag um Löschen anzugeben."
    },

    // unlearn.js
    "tagdoesnotexist": {
        "en": "This tag does not seem to exist.",
        "de": "Dieser Tag scheint nicht zu existieren."
    },

    // unlearn.js
    "tagunlearned": {
        "en": "Unlearned the tag: ",
        "de": "Folgender Tag wurde gelöscht: "
    }
}