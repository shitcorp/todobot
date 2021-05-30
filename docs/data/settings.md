# /settings
> View and edit bot settings. 

# Subcommands

## /settings set 

| Name | Description | Type | Required? | 
| :-- | :-- | :-- | :-- | 
| prefix | The prefix the bot will use for your custom commands or tags. | String (Text) | ❌ | 
| todochannel | The channel that will be used to post your todos in. | Channel | ❌ | 
| readonlychannel | The channel that will be used to keep your community updated. | Channel | ❌ | 
| userrole | Add a new userrole. Userroles can interact with the bot but cannot change bot settings. | Role | ❌ | 
| staffrole | Add a new staffrole. Staffroles can edit bot settings and force assign users. | Role | ❌ | 
| language | The language the bot uses to talk to you. | String (Text) | ❌ | 
| autopurge | Toggle messages being auto purged in the todochannel. | Boolean (true or false) | ❌ | 
| todomode | Toggle between simple (one channel) and advanced (multiple channels) mode | String (Text) | ❌ | 
## /settings view 

No arguments required. Description: 
> View your current settings. 
## /settings remove 

| Name | Description | Type | Required? | 
| :-- | :-- | :-- | :-- | 
| userrole | Add a new userrole. Userroles can interact with the bot but cannot change bot settings. | Role | ❌ | 
| staffrole | Add a new staffrole. Staffroles can edit bot settings and force assign users. | Role | ❌ | 



# Some Additional Information

## Readonly Setting

If you set a readonly channel, you can from now on use the `share` reaction ![](https://cdn.discordapp.com/attachments/724022854231916684/844963684501684234/unknown.png) to share the todo to the channel that you configured. All changes to that TODO will be mirrored to that channel, so if someone finishes a task, edits the todo or closes it, everything will be shown in the read only channel.

## User/Staff Roles

These roles are used to determine permissions. "USERs" are users that can interact with the bot. People with the "STAFF" role are users that can change and edit bot settings and force assing users. Having the discord permission `MANAGE GUILD` will override this permission system and allow you to edit the bots settings.

## Autopurge

If you enable this setting, all messages that are sent in your configured todo channel and are not from the bot or a user without the `STAFF` role will be deleted. This is useful if you want to use your todochannel for tasks only and keep the chatting in other channels.

## Todomode

As you may have seen, there are 2 choices for this: `simple` and `advanced`:

**Simple**

> In this mode all "todo activity" will happen in the preconfigured TODO channel. Means if you run the todo command in lets say the `general` channel, your todo will pop up in the configured todo channel (lets call it `tasks`).

**Advanced**

> In this mode, the todos will be created in the channel, where the todo command is run in. So lets say you run the todo command in the `general` channel, the todo will pop up in this very `general` channel.