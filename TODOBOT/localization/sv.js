const pkg = require('../../package.json')

module.exports = {
    Errors: {
        addbottoguild:
            'Kunde inte hitta en config fil för din guild. För att ändra skriv `/settings set` en gång.',
        generalerror: `Ett problem har intreäffat. Om det kvarstår kan du kontakta support via discord (/support) kommandot, eller skapa ett inlägg på [github](${pkg.bugs.url})`,
        permissionleveltoolow: 'Du har inte tillräckligt höga rättigheter för detta kommando.',
        blacklisted: 'Du eller kanalen du är i är svartlistad.',
    },

    Reactions: {
        editReactionUsage: `__**Användande:**__
            Ange nyckeln du vill redigera följt av det nya värdet åtskilt av ett komma och ett mellanslag. **Mellanslaget efter kommat är viktigt och är inte valfritt!**
            Om du bara vill lägga till det redan befintliga värdet, prefixar du bara ditt nya innehåll med ett **+**
            __**Exempel:**__
            > title, detta är den nya titeln
            > content, det här är ditt nya innehåll
            > content, +oh shit i forgot ...
            > attachment, Glömde att lägga till detta tidigare: https://dummy.com/projects/work/task/1
            > loop, true
            > category, viktigt
            > category, Anpassad kategori`,
        timeisuperror: 'Du misslyckades att svara i tid!',
    },

    TODO: {
        todoposted:
            'Bra! Din TODO har publicerats. Reagera med  <:accept_todo:822495794602442814> för att tilldela det till dig själv och när du är klar, reagera med <:finish:820576533059600394> för att stänga TODO.',

        cantclosetodo: 'Du kan inte stänga den här TODO om du inte har slutfört alla uppgifter.',
        alreadyassigned: 'Du är redan tilldelad.',
        novalidkey:
            'Detta är inte en giltig nyckel att redigera. Giltiga nycklar är: title, attachment loop, state, content och category',
        noreadonlychannel:
            'Du har ingen skrivskyddad kanal specificerad i din konfiguration. Fixa det genom att skriva: /settings set readonlychannel: #somechannel',
        notodochannel:
            'Det finns ingen todo-kanal konfigurerad för din guild. Fixa det genom att skriva: `/settings set todochannel: yourchannel`',
        unabletoposttodo:
            "Jag kunde inte lägga upp din todo. Se till att jag har behörighet i din todo-kanal. Se också till att du har ställt in en kanal där jag ska lägga upp uppgifterna. Om inte skirv `/settings set` kommandot \n\nJag behöver följande behörigheter: 'SEND MESSAGES', 'READ MESSAGES', 'MANAGE MESSAGES', 'ATTACH LINKS', 'USE EXTERNAL EMOJIS'",
        only10tasksallowed: 'Endast 10 uppgifter är tillåtna, så jag begränsade din uppgiftslista vid 10.',
    },

    Query: {
        nothingfound: 'Det hittades inget som matchade dina sökkriterier.',
        databaseerror: 'Något gick fel när vi försökte fråga databasen.',
        nosearchcriteria: 'Du gav inga sökkriterier efter `WHERE` nyckelordet.',
        wrongqueryselector:
            'Detta är inte en giltig frågeväljare. Skriv `//help query` för mer information om hur du använder frågekommandot.',
    },

    Tag: {
        cantoverwritecommands: 'Du kan inte överskrida bot-kommandon eller alias med taggar.',
        tagalreadyexists: 'Den här taggen finns redan, tabort den först innan du skriver över..',
        descriptiontoolong: 'Din beskrivning var för lång. Från `1000` tillgängliga tecken använde du: ',
        tagsaved: 'Sparade den nya taggen åt dig. Sammanfattning: ',
        tagdoesnotexist: 'Den här taggen verkar inte finnas.',
        tagunlearned: 'Avlärde taggen: ',
        availabletags: 'Tillgängliga taggar: ',
    },

    Shorten: {
        nolinkgiven: 'Du har glömt att ange en länk för att förkorta.',
        backendoffline: `Backend verkar vara offline. Försök kanske senare?... 
            Om problemet kvarstår, vänligen kontakta utvecklarna på discord eller öppna ett problem på [github](${pkg.bugs.url})`,
        somethingwentwrong: 'Något gick fel när jag försökte hämta din länk',
        notacceptablelink: 'Länken du vill förkorta verkar inte vara acceptabel.',
        toomanyrequests: 'För många förfrågningar, försök igen senare.',
        shortenedurl: 'Här är din förkortade URL. \nTänk på att den löper ut om 24 timmar. \n',
    },

    Blacklist: {
        useralreadyblacklisted: 'Användaren är redan svartlistad.',
        updatedyourblacklist: 'Uppdaterade din svartlista.',
        channelalreadyblacklisted: 'Kanalen är redan svartlistad.',
        usernotblacklisted: 'Användaren är inte svartlistad.',
        channelnotblacklisted: 'Kanalen är inte svartlistad.',
        noitemsonblacklist: 'För närvarande finns det inga objekt på dina svartlistor.',
        cannotblacklistbots: 'Du kan inte svartlista bots.',
        nouserorchannelgiven: 'Du måste ge en användare eller kanal som du vill svartlista.',
    },

    Reminder: {
        noopenreminders:
            'Du har inga öppna påminnelser just nu. Om du vill lära dig mer om påminnelsefunktionen skriv `/help reminder`.',
        contenttoolarge: 'Ditt innehåll är för stort, från 400 tillgängliga tecken använde du',
        remindercreated: 'Din nya påminnelse skapades!',
        updatedreminder: 'Uppdaterad din påminnelse.',
        deletedreminder: 'Tog bort din påminnelse.',
    },

    Support: {
        supportmessage: `Kontakta supporten via discord [Klicka här](https://discord.gg/RuEdX5T "https://discord.gg/RuEdX5T").             
            > Om det finns ett problem med botten, öppna ett problem på [github](${pkg.bugs.url})`,
    },

    Invite: {
        invitemessage:
            '[Bjud in mig till din server.](http://invite.todo-bot.xyz "http://invite.todo-bot.xyz")',
    },

    Help: {
        available_commands: 'Tillgängliga kommandon',
        moreinformation: 'För mer information om ett specifikt kommando skriv `/help <kommando>`.',
        commandnotfound: 'Kommando inte hittat.',
    },

    Assign: {
        cannotassignbots: 'Du kan inte tilldela bots.',
        tododoesntexist: 'Denna TODO verkar inte existera.',
        useralreadyassigned: 'Denna användare har redan tilldelats.',
    },

    Settings: {
        savedsettings: 'Sparade dina nya inställningar.',
        rolenotinarray: 'Denna roll finns inte i din användar/staff-lista.',
    },

    Suggest: {
        requestsubmitted: 'Ditt förslag eller förfrågan har skickats in.',
        errorposting:
            'Det gick inte att lägga upp dina förslag. Var webbadressen till din bild väl formaterad?',
    },

    Variables: {
        savedvar: 'Sparade din nya variabel. \n__**Summary:**__',
        varalreadyexists: 'Denna variabel finns redan.',
        updatedvar: 'Uppdaterade din variabel. \n__**Summary:**__',
        varmustexist: 'Du kan bara ta bort variabler som finns.',
        deletedvar: 'Raderade variabeln med namnet: ',
    },
}
