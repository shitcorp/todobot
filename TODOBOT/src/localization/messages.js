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

const pkg = require('../../package.json');

module.exports = {



    /******************
     * 
     *  GENERAL ERRORS
     * 
     *****************/

    "addbottoguild": {
        "en": "I couldn\'t find any configuration for your guild. To change that run the \`/settings set\` command once.",
        "de": "Ich habe keine Konfiguration für deinen Server gefunden. Um eine zu erstellen, benutze bitte den \`/settings set\` command"
    },

    'generalerror': {
        'en': `An error occured, please try again.
        
        If the error persits, join the support discord (/support), or open an issue on [github](${pkg.bugs.url})`,
        'de': `Ein Fehler ist aufgetreten, bitte versuche es noch einmal.
        
        Sollte der Fehler bestehen, tritt dem supportdiscord (/support) bei, oder öffne einen Issue auf [Github](${pkg.bugs.url})`
    },

    'permissionleveltoolow': {
        'en': 'You can not use this command because your permission level is too low.',
        'de': 'Du kannst diesen Command nicht benutzen, da dein Permission Level zu niedrig ist.'
    },

    'blacklisted': {
        'en': 'Either you or the channel you are in, are blacklisted fro bot usage.',
        'de': 'Entweder du, oder der channel in dem du bist wurden geblacklisted und du kannst den bot hier nicht benutzen.'
    },







    /*******************************
     * 
     *  REACTIONS (REACTION EVENT)
     * 
     ******************************/

    "editReactionUsage": {
        "en": `
        __**Usage:**__

        Enter the key you want to edit followed by the new value seperated by a comma and a space. **The space after the comma is important and not optional!**
        If you just want to add to the already exiting value, just prefix your new content with a **+**


        __**Examples:**__

        > title, this is the new title

        > content, this is my new content

        > content, +oh shit i forgot ...

        > attachment, Forgot to add this earlier: https://dummy.com/projects/work/task/1

        > loop, true

        > category, important

        > category, MyCustomCategory
        `,
        "de": `
        __**Tutorial**__

        Gib den key ein, den du bearbeiten willst, gefolgt von einem Komma, gefolgt vom neuen Value. Denk dran ein Leerzeichen hinter dem Komma zu setzen!

        Wenn du nur neuen Conent hinzufügen möchtest, setze ein **+** vor deinen neuen content.

        __**Beispiele:**__

        > title, Das ist mein neuer Titel

        > content, Das ist mein neuer Content

        > content, +ganz vergessen ...

        > attachment, Vorhin vergessen anzuhängen: https://dummy.com/projects/work/task/1

        > loop, true

        > category, WICHTIG

        > category, Custom Category
        `
    },

    "timeisuperror": {
        "en": "You failed to respond in time!",
        "de": "Du hast nich rechtzeitig reagiert!"
    },






    /*****************
     * 
     *  TODO COMMAND
     * 
     *****************/


    "todoposted": {
        "en": "Great! Your TODO has been posted. React with  <:accept_todo:822495794602442814>  to assign it to yourself and when you're done, react with  <:finish:820576533059600394>  to close the TODO.",
        "de": "Super! Deine neue Aufgabe wurde gepostet, Reagiere mit  <:accept_todo:822495794602442814>  um dich der Aufgabe anzunehmen und mit  <:finish:820576533059600394>  wenn du fertig mit der Aufgabe bist."
    },


    'cantclosetodo': {
        'en': 'You can\'t close this TODO unless you have finished all tasks.',
        'de': 'Du kannst dieses TODO nicht schließen, so lange du noch offene Aufgaben hast.'
    },

    'alreadyassigned': {
        'en': 'You are already assigned.',
        'de': 'Das TODO ist dir bereits zugewiesen.'
    },

    'novalidkey': {
        'en': 'This is not a valid key to edit. Valid keys are: title, attachment loop, state, content and category.',
        'de': 'Diese Einstellung kann nicht bearbeitet werden. Verfügbare Einstellungen sind: title, attachment, loop, state, content und category.'
    },

    'noreadonlychannel': {
        'en': 'You have no readonly channel specified in your config. Do so by running the settings command like so: /settings set readonlychannel: #somechannel',
        'de': 'Du hast keinen read only channel in deiner config festgelegt. Um das zu tun, benutze den comand /settings set readonlychannel: #irgendeinchannel'
    },

    'notodochannel': {
        'en': 'There is no todo channel configured for your guild. Make sure to set it by running the settings command like so: \`/settings set todochannel: yourchannel\`',
        'de': 'Du hast keinen todo channel eingestellt. Das kannst du ändern mit dem Command \`/settings set todochannel: #deinchannel\`'
    },

    "unabletoposttodo": {
        "en": "I was unable to post your todo. Please make sure I have required permissions in your todo channel. Also make sure you have set a channel where I should post the tasks. If not run the `/settings set`  command \n\nI need the following permissions: 'SEND MESSAGES', 'READ MESSAGES', 'MANAGE MESSAGES', 'ATTACH LINKS', 'USE EXTERNAL EMOJIS'",
        "de": "Ich konnte deine Aufgabe leider nicht posten. Stelle bitte sicher, dass ich die benötigten Berechtigungen habe, um in deinem TODO-Channel Nachrichten zu lesen und zu schreiben. Hast du vielleicht vergessen, einen Channel festzulegen, in dem ich deine Aufgaben posten soll? Falls ja, lege ihn jetzt mit dem `/settings set` command fest. \n\nIch benötige die folgenden Permissions: 'SEND MESSAGES', 'READ MESSAGES', 'MANAGE MESSAGES', 'ATTACH LINKS', 'USE EXTERNAL EMOJIS'"
    },

    "only10tasksallowed": {
        "en": "Only 10 tasks are allowed, so i capped your task list at 10.",
        "de": "Es sind maximal 10 Aufgaben erlaubt, deshalb wurde deine TODO-Liste bei 10 Elementen abgeschnitten."
    },








    /*******************
     * 
     *  QUERY COMMAND
     * 
     *****************/


    "nothingfound": {
        "en": "There was nothing found matching your search criteria.",
        "de": "Wir konnten nichts finden, dass deinem Suchkriterium entsprach."
    },

    "databaseerror": {
        "en": "Something went wrong when trying to query the database.",
        "de": "Es ist ein Fehler beim Durchsuchen der Datenbank aufgetreten"
    },

    "nosearchcriteria": {
        "en": "You didnt give any search criteria afer the \`WHERE\` keyword.",
        "de": "Du hast vergessen einen Suchbegriff nach dem \`WHERE\` einzugeben."
    },

    "wrongqueryselector": {
        "en": "This is not a valid query selector. Run `//help query` for more information on how to use the query command.",
        "de": ""
    },







    /***************
     * 
     *  TAG COMMAND
     * 
     **************/

    "cantoverwritecommands": {
        "en": "You cant override bot commands or aliases with tags.",
        "de": "Du kannst Bot Commands oder ihre Aliase nicht mit Tags überschreiben"
    },

    "tagalreadyexists": {
        "en": "This tag already exists, unlearn it first before overwriting..",
        "de": "Dieser Tag existiert bereits, lösche ihn zuerst (//unlearn).."
    },

    "descriptiontoolong": {
        "en": "Your description was too long. From \`1000\` available characters you used: ",
        "de": "Deine Beschreibung war zu lang. Von \`1000\` verfügbaren Zeichen hast du benutzt: "
    },

    "tagsaved": {
        "en": "Saved the new tag for you. Summary: ",
        "de": "Dein neuer Tag wurde gespeichert. Zusammenfassung: "
    },

    "tagdoesnotexist": {
        "en": "This tag does not seem to exist.",
        "de": "Dieser Tag scheint nicht zu existieren."
    },

    "tagunlearned": {
        "en": "Unlearned the tag: ",
        "de": "Folgender Tag wurde gelöscht: "
    },

    "availabletags": {
        "en": "Available Tags: ",
        "de": "Verfügbare Tags: "
    },





    /*******************
     * 
     *  SHORTEN COMMAND
     * 
     ******************/

    "nolinkgiven": {
        "en": "You forgot to enter a link to shorten.",
        "de": "Du hast vergessen einen Link zum verkürzen einzugeben."
    },

    "backendoffline": {
        "en": `The backend seems to be offline. Maybe try again later?... 
        
        If the problem persists please contact the developers on discord or open an issue on [github](${pkg.bugs.url})`,
        "de": ""
    },

    "somethingwentwrong": {
        "en": "Something went wrong while trying to fetch your link",
        "de": ""
    },

    "notacceptablelink": {
        "en": "The link you want to shorten does not seem to be acceptable.",
        "de": ""
    },

    "toomanyrequests": {
        "en": "Too many requests, try again later.",
        "de": ""
    },

    "shortenedurl": {
        "en": "Heres your shortened URL. \nKeep in mind that it expires in 24 hours. \n",
        "de": "Hier ist dein Kurzlink. \nDenk dran dass der Link in 24 Stunden gelöscht wird. \n"
    },













    /**********************
     * 
     *  BLACKLIST COMMAND
     * 
     *********************/

    'useralreadyblacklisted': {
        'en': 'This user is already blacklisted.',
        'de': 'Dieser User ist bereits auf der Blacklist'
    },

    'updatedyourblacklist': {
        'en': 'Updated your blacklist.',
        'de': 'Deine neue Blacklist wurde gespeichert.'
    },

    'channelalreadyblacklisted': {
        'en': 'This channel is already blacklisted.',
        'de': 'Dieser channel ist bereits auf der blacklist.'
    },

    'usernotblacklisted': {
        'en': 'This user is not blacklisted.',
        'de': 'Dieser User ist nicht auf der Blacklist.'
    },

    'channelnotblacklisted': {
        'en': 'This Channel is not blacklisted.',
        'de': 'Dieser Channel ist nicht auf der Blacklist.'
    },

    'noitemsonblacklist': {
        'en': 'Currently there are no items on your blacklists.',
        'de': 'Momentan befinden sich keine User oder Channels auf deiner Blacklist.'
    },

    'cannotblacklistbots': {
        'en': 'You cannot blacklist bots.',
        'de': 'Du kannst Bots nicht blacklisten.'
    },

    'nouserorchannelgiven': {
        'en': 'You need to give a user or channel that you want to blacklist.',
        'de': 'Du musst einen User oder Channel angeben den du blacklisten willst.'
    },








    /********************
     * 
     *  REMINDER COMAND
     * 
     *******************/

    'noopenreminders': {
        'en': 'You have no open reminders at the moment. To learn more about the reminder feature run \`/help reminder\`.',
        'de': 'Momentan hast du keine offenen reminder. Um mehr über das Reminder Feature herauszufinden, benutze den comand \`/help reminder\`.'
    },

    'contenttoolarge': {
        'en': 'Your Content is too large, from 400 available characters you used ',
        'de': 'Dein Content ist zu lang, von 400 verfügbaren Characteren hast du benutzt '
    },

    'remindercreated': {
        'en': 'Your new reminder was created!',
        'de': 'Dein neuer Reminder wurde gespeichert!'
    },

    'updatedreminder': {
        'en': 'Updated your reminder.',
        'de': 'Dein Reminder wurde geupdated.'
    },

    'deletedreminder': {
        'en': 'Deleted your reminder.',
        'de': 'Dein Reminder wurde gelöscht.'
    },









    /********************
     * 
     *  SUPPORT COMMAND
     * 
     *******************/

    'supportmessage': {
        'en': `To join the support discord [click here](https://discord.gg/RuEdX5T "https://discord.gg/RuEdX5T"). 
        
        > If there is an issue with the bot, open an issue over at [github](${pkg.bugs.url})`,
        'de': `Um dem Support Server beizutreten, clicke [hier](https://discord.gg/RuEdX5T "https://discord.gg/RuEdX5T")
        
        > Wenn es ein Problem mit dem Bot gibt, öffne bitte einen issue auf [Github](${pkg.bugs.url})`
    },







    /*******************
     * 
     *  INVITE COMMAND
     * 
     *****************/

    'invitemessage': {
        'en': '[Invite me to your server.](http://invite.todo-bot.xyz "http://invite.todo-bot.xyz")',
        'de': '[Lade mich auf deinen Server ein](http://invite.todo-bot.xyz "http://invite.todo-bot.xyz")'
    },






    /****************
     * 
     *  HELP COMMAND
     * 
     ***************/

    'available_commands': {
        'en': 'Available Commands',
        'de': 'Verfügbare Commands'
    },

    'moreinformation': {
        'en': 'For more information about a specific command run the command \`/help <commandname>\`.',
        'de': 'Für mehr informationen über einen speziellen command benutze den help command folgendermaßen: \`/help <commandname>\`'
    },

    'commandnotfound': {
        'en': 'Command not found.',
        'de': 'Command wurde nicht gefunden.'
    },






    /******************
     * 
     *  ASSIGN COMMAND
     * 
     *****************/

    'cannotassignbots': {
        'en': 'You cannot assign bots.',
        'de': 'Du kannst keine Bots zuweisen.'
    },


    'tododoesntexist': {
        'en': 'This TODO does not seem to exist.',
        'de': 'Dieses TODO scheint nicht zu existieren.'
    },

    'useralreadyassigned': {
        'en': 'This user is already assigned.',
        'de': 'Dieser User ist bereits zugewiesen.'
    },







    /*********************
     * 
     *  SETTINGS COMMAND
     * 
     ********************/


    'savedsettings': {
        'en': 'Saved your new settings.',
        'de': 'Deine neuen Einstellungen wurden gespeichert.'
    },

    'rolenotinarray': {
        'en': 'This role is not in your user- or  staffroles array.',
        'de': 'Diese Rolle befindet sich nicht im User oder Staffrollen Array'
    },







    /*******************
     * 
     *  SUGGEST COMMAND
     * 
     ******************/

    'requestsubmitted': {
        'en': 'Your suggestion or feature request has been submitted.',
        'de': 'Deine Suggestion oder Feature Request wurde erfolgreich geposted.'
    },

    'errorposting': {
        'en': 'There was an error trying to post your suggestions. Was your image URL well formatted?',
        'de': 'Es ist ein Fehler aufgetreten beim Posten deiner Suggestion. War der Link zu deinem Bild vielleicht falsch?'
    },




    /********************
     * 
     *  VARIABLE COMMAND
     * 
     *******************/

    'savedvar': {
        'en': 'Saved your new Variable. \n__**Summary:**__ ',
        'de': 'Deine neue Variable wurde gespeichert. __**Zusammenfassung:**__\n'
    },

    'varalreadyexists': {
        'en': 'This variable already exists.',
        'de': 'Diese Variable existiert bereits.'
    },

    'updatedvar': {
        'en': 'Updated your Variable. \n__**Summary:**__ ',
        'de': 'Deine Variable wurde geupdated. \n__**Zusammenfassung:**__'
    },

    'varmustexist': {
        'en': 'You can only delete variables that exist.',
        'de': 'Du kannst nur variablen löschen die existieren.'
    },

    'deletedvar': {
        'en': 'Deleted the variable with the name: ',
        'de': 'Folgende Variable wurde gelöscht: '
    },





}