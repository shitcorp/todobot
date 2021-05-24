const pkg = require('../../../package.json')
module.exports = {
    Errors: {
        addbottoguild:
            "I couldn't find any configuration for your guild. To change that run the `/settings set` command once.",
        generalerror: `An error occured, please try again. If the error persits, join the support discord (/support), or open an issue on [github](${pkg.bugs.url})`,
        permissionleveltoolow: 'You can not use this command because your permission level is too low.',
        blacklisted: 'Either you or the channel you are in, are blacklisted fro bot usage.',
    },

    Reactions: {
        editReactionUsage: `__**Usage:**__
            Enter the key you want to edit followed by the new value seperated by a comma and a space. **The space after the comma is important and not optional!**
            If you just want to add to the already exiting value, just prefix your new content with a **+**
            __**Examples:**__
            > title, this is the new title
            > content, this is my new content
            > content, +oh shit i forgot ...
            > attachment, Forgot to add this earlier: https://dummy.com/projects/work/task/1
            > loop, true
            > category, important
            > category, MyCustomCategory`,

        timeisuperror: 'You failed to respond in time!',
    },

    TODO: {
        todoposted:
            "Great! Your TODO has been posted. React with  <:accept_todo:822495794602442814>  to assign it to yourself and when you're done, react with  <:finish:820576533059600394>  to close the TODO.",

        cantclosetodo: "You can't close this TODO unless you have finished all tasks.",
        alreadyassigned: 'You are already assigned.',
        novalidkey:
            'This is not a valid key to edit. Valid keys are: title, attachment loop, state, content and category.',
        noreadonlychannel:
            'You have no readonly channel specified in your config. Do so by running the settings command like so: /settings set readonlychannel: #somechannel',
        notodochannel:
            'There is no todo channel configured for your guild. Make sure to set it by running the settings command like so: `/settings set todochannel: yourchannel`',
        unabletoposttodo:
            "I was unable to post your todo. Please make sure I have required permissions in your todo channel. Also make sure you have set a channel where I should post the tasks. If not run the `/settings set`  command \n\nI need the following permissions: 'SEND MESSAGES', 'READ MESSAGES', 'MANAGE MESSAGES', 'ATTACH LINKS', 'USE EXTERNAL EMOJIS'",
        only10tasksallowed: 'Only 10 tasks are allowed, so i capped your task list at 10.',
    },

    Query: {
        nothingfound: 'There was nothing found matching your search criteria.',
        databaseerror: 'Something went wrong when trying to query the database.',
        nosearchcriteria: 'You didnt give any search criteria afer the `WHERE` keyword.',
        wrongqueryselector:
            'This is not a valid query selector. Run `//help query` for more information on how to use the query command.',
    },

    Tag: {
        cantoverwritecommands: 'You cant override bot commands or aliases with tags.',
        tagalreadyexists: 'This tag already exists, unlearn it first before overwriting..',
        descriptiontoolong: 'Your description was too long. From `1000` available characters you used: ',
        tagsaved: 'Saved the new tag for you. Summary: ',
        tagdoesnotexist: 'This tag does not seem to exist.',
        tagunlearned: 'Unlearned the tag: ',
        availabletags: 'Available Tags: ',
    },

    Shorten: {
        nolinkgiven: 'You forgot to enter a link to shorten.',
        backendoffline: `The backend seems to be offline. Maybe try again later?... 
            If the problem persists please contact the developers on discord or open an issue on [github](${pkg.bugs.url})`,
        somethingwentwrong: 'Something went wrong while trying to fetch your link',
        notacceptablelink: 'The link you want to shorten does not seem to be acceptable.',
        toomanyrequests: 'Too many requests, try again later.',
        shortenedurl: 'Here is your shortened URL. \nKeep in mind that it expires in 24 hours. \n',
    },

    Blacklist: {
        useralreadyblacklisted: 'This user is already blacklisted.',
        updatedyourblacklist: 'Updated your blacklist.',
        channelalreadyblacklisted: 'This channel is already blacklisted.',
        usernotblacklisted: 'This user is not blacklisted.',
        channelnotblacklisted: 'This Channel is not blacklisted.',
        noitemsonblacklist: 'Currently there are no items on your blacklists.',
        cannotblacklistbots: 'You cannot blacklist bots.',
        nouserorchannelgiven: 'You need to give a user or channel that you want to blacklist.',
    },

    Reminder: {
        noopenreminders:
            'You have no open reminders at the moment. To learn more about the reminder feature run `/help reminder`.',
        contenttoolarge: 'Your Content is too large, from 400 available characters you used',
        remindercreated: 'Your new reminder was created!',
        updatedreminder: 'Updated your reminder.',
        deletedreminder: 'Deleted your reminder.',
    },

    Support: {
        supportmessage: `To join the support discord [click here](https://discord.gg/RuEdX5T "https://discord.gg/RuEdX5T").             
            > If there is an issue with the bot, open an issue over at [github](${pkg.bugs.url})`,
    },

    Invite: {
        invitemessage: '[Invite me to your server.](http://invite.todo-bot.xyz "http://invite.todo-bot.xyz")',
    },

    Help: {
        available_commands: 'Available Commands',
        moreinformation:
            'For more information about a specific command run the command `/help <commandname>`.',
        commandnotfound: 'Command not found.',
    },

    Assign: {
        cannotassignbots: 'You cannot assign bots.',
        tododoesntexist: 'This TODO does not seem to exist.',
        useralreadyassigned: 'This user is already assigned.',
    },

    Settings: {
        savedsettings: 'Saved your new settings.',
        rolenotinarray: 'This role is not in your user- or  staffroles array.',
    },

    Suggest: {
        requestsubmitted: 'Your suggestion or feature request has been submitted.',
        errorposting:
            'There was an error trying to post your suggestions. Was your image URL well formatted?',
    },

    Variables: {
        savedvar: 'Saved your new Variable. \n__**Summary:**__',
        varalreadyexists: 'This variable already exists.',
        updatedvar: 'Updated your Variable. \n__**Summary:**__',
        varmustexist: 'You can only delete variables that exist.',
        deletedvar: 'Deleted the variable with the name: ',
    },
}
