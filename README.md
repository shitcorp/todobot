<h1 align="center"> TODO Bot for  Discord  
<a href="http://invite.todo-bot.xyz">
    <img src="https://img.shields.io/badge/Add%20Bot-7289DA.svg?style=for-the-badge"/>
</a>
</h1>

<h4 align="center">

<img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge" />

<a href="https://discord.gg/RuEdX5T">
<img src="https://img.shields.io/discord/710022036252262485?style=for-the-badge"/>
</a>

<img src="https://img.shields.io/github/license/MeerBiene/TODOBOT?style=for-the-badge"/>


</h4>

<h3 align="center">

<img src="https://raw.githubusercontent.com/shitcorp/TODOBOT/master/assets/gifs/todo_cmd_demo.gif" />
</h3>

<br>

# 📝 About the Bot

This Bot aims to provide a virtual TODO list inside your discord server. Instead of relying on commands for interacting with the bot, I tried my best to make the entire "user interface" with reactions. That way your users dont have to learn hundrets of new commands and how to use them.

<br>

# 🎬 Getting Started

After inviting the Bot to your server, run the command `/settings set todochannel: #yourchannel`. This generates a new config and saves your todochannel. Your TODOS or tasks will then be posted in that channel.

<details>
<summary>Click to see the bot in action</summary>

![getting started demo](https://github.com/shitcorp/TODOBOT/raw/main/assets/gifs/getting-started.gif)

</details>

<br>

# 🖥️ Commands

To view all the commands the bot supports, run the `/help` command. If you want to get more specific information about a command run the command `/help` with the command that you want information about as frist argument. So if you wanted to get information about the todo command, you would want to run the command like so: `/help todo`.

**Available Commands:**

<!--STARTCMDSECTION-->

<details>
<summary>assign</summary>

# /assign
> Assign someone to a task no matter if they want or not. 

# Arguments

| Name | Description                                         | Type          | Required? |
| :--- | :-------------------------------------------------- | :------------ | :-------- |
| user | The user you want to assign.                        | User          | ✔️         |
| id   | ID of the task that you want to assing the user to. | String (Text) | ✔️         |



# Assign Command
Welcome to the documentation of the `assign` command. It is used to assign members to tasks.

</details>
<details>
<summary>blacklist</summary>

# /blacklist
> Blacklist user(s) and/or channel(s) 

# Subcommands

## /blacklist add 

| Name    | Description                       | Type    | Required? |
| :------ | :-------------------------------- | :------ | :-------- |
| user    | The user you want to blacklist    | User    | ❌         |
| channel | The channel you want to blacklist | Channel | ❌         |
## /blacklist remove 

| Name    | Description                       | Type    | Required? |
| :------ | :-------------------------------- | :------ | :-------- |
| user    | The user you want to blacklist    | User    | ❌         |
| channel | The channel you want to blacklist | Channel | ❌         |
## /blacklist list 

No arguments required. Description: 
> Show your current blacklists. 



</details>
<details>
<summary>help</summary>

# /help
> Show all available commands and their usage. 

# Arguments

| Name    | Description                                     | Type          | Required? |
| :------ | :---------------------------------------------- | :------------ | :-------- |
| command | The command you want specific infomation about. | String (Text) | ❌         |



</details>
<details>
<summary>invite</summary>

# /invite
> Invite the bot to your server.

</details>
<details>
<summary>list</summary>

# /list
> List todos for your server. Use the 🔄 emoji to repot the currently open todo. Use the arrow emojis to navigate.

</details>
<details>
<summary>reminder</summary>

# /reminder
> Create, edit and view reminders 

# Subcommands

## /reminder create 

| Name               | Description                                                 | Type                       | Required? |
| :----------------- | :---------------------------------------------------------- | :------------------------- | :-------- |
| time               | After this timespan you will be reminded.                   | Number (0, 1, 2, 3, 4 ...) | ✔️         |
| unit               | Minutes? Hours? Seconds? Choose now.                        | String (Text)              | ✔️         |
| content            | Reminder Text that will be shown when the reminder expires. | String (Text)              | ✔️         |
| participants       | Choose another user or users that should also be reminded.  | User                       | ❌         |
| participatingRoles | Choose a role that should be reminded.                      | Role                       | ❌         |
## /reminder view 

No arguments required. Description: 
> View your reminder(s). 



</details>
<details>
<summary>settings</summary>

# /settings
> View and edit bot settings. 

# Subcommands

## /settings set 

| Name            | Description                                                                             | Type                    | Required? |
| :-------------- | :-------------------------------------------------------------------------------------- | :---------------------- | :-------- |
| prefix          | The prefix the bot will use for your custom commands or tags.                           | String (Text)           | ❌         |
| todochannel     | The channel that will be used to post your todos in.                                    | Channel                 | ❌         |
| readonlychannel | The channel that will be used to keep your community updated.                           | Channel                 | ❌         |
| userrole        | Add a new userrole. Userroles can interact with the bot but cannot change bot settings. | Role                    | ❌         |
| staffrole       | Add a new staffrole. Staffroles can edit bot settings and force assign users.           | Role                    | ❌         |
| language        | The language the bot uses to talk to you.                                               | String (Text)           | ❌         |
| autopurge       | Toggle messages being auto purged in the todochannel.                                   | Boolean (true or false) | ❌         |
| todomode        | Toggle between simple (one channel) and advanced (multiple channels) mode               | String (Text)           | ❌         |
## /settings view 

No arguments required. Description: 
> View your current settings. 
## /settings remove 

| Name      | Description                                                                             | Type | Required? |
| :-------- | :-------------------------------------------------------------------------------------- | :--- | :-------- |
| userrole  | Add a new userrole. Userroles can interact with the bot but cannot change bot settings. | Role | ❌         |
| staffrole | Add a new staffrole. Staffroles can edit bot settings and force assign users.           | Role | ❌         |



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

</details>
<details>
<summary>shorten</summary>

# /shorten
> Shorten a link. 

# Arguments

| Name   | Description                                         | Type          | Required? |
| :----- | :-------------------------------------------------- | :------------ | :-------- |
| Link   | The link that you want to get shortened.            | String (Text) | ✔️         |
| Domain | The domain you want to use for your shortened link. | String (Text) | ❌         |



</details>
<details>
<summary>stats</summary>

# /stats
> Show some bot statistics like memory or CPU Usage.

</details>
<details>
<summary>suggest</summary>

# /suggest
> Suggest new features to be added into the bot 

# Arguments

| Name   | Description                                         | Type                    | Required? |
| :----- | :-------------------------------------------------- | :---------------------- | :-------- |
| text   | Your suggestion                                     | String (Text)           | ✔️         |
| image  | If you want to attach an image, paste the link here | String (Text)           | ❌         |
| hidden | Hide the server where this suggestion was sent      | Boolean (true or false) | ❌         |



</details>
<details>
<summary>support</summary>

# /support
> Get information on how to contact the developer(s).

</details>
<details>
<summary>tag</summary>

# /tag
> Bild your own commands like a pro. 

# Subcommands

## /tag learn 

| Name    | Description                                                            | Type          | Required? |
| :------ | :--------------------------------------------------------------------- | :------------ | :-------- |
| name    | The name of your new command/tag.                                      | String (Text) | ✔️         |
| content | This is the content that will be sent when your custom command is run. | String (Text) | ✔️         |
## /tag unlearn 

| Name | Description                     | Type          | Required? |
| :--- | :------------------------------ | :------------ | :-------- |
| name | The command you want to delete. | String (Text) | ✔️         |
## /tag edit 

| Name    | Description                                      | Type          | Required? |
| :------ | :----------------------------------------------- | :------------ | :-------- |
| name    | Name of the command you want to edit.            | String (Text) | ✔️         |
| content | The content that you want to save as the new tag | String (Text) | ✔️         |
## /tag list 

No arguments required. Description: 
> List available tags. 



</details>
<details>
<summary>todo</summary>

# /todo
> Create a new TODO object 

# Arguments

| Name     | Description                                                                                       | Type                    | Required? |
| :------- | :------------------------------------------------------------------------------------------------ | :---------------------- | :-------- |
| title    | Title of the TODO object                                                                          | String (Text)           | ✔️         |
| tasks    | The tasks that belong to this todo. Seperate them with a semicolon (;). Maximum 10 tasks allowed! | String (Text)           | ❌         |
| content  | Content of the TODO object                                                                        | String (Text)           | ❌         |
| url      | Attach a link to the todo                                                                         | String (Text)           | ❌         |
| image    | Attach an image to the todo. Has to be a discord attachment link.                                 | String (Text)           | ❌         |
| category | The category this todo should belong to.                                                          | String (Text)           | ❌         |
| loop     | Create repeating tasks                                                                            | Boolean (true or false) | ❌         |



# Images & Attachments
If you want to attach an image to your task, you can simply upload an image and give it a title like so: {{thisismytitle}} ("thisismytitle" will then be the title to reference). 


When creating your task then reference the image with your title in the image options. The image will then be embedded into your todo list. **Note:** The image will be available 24hrs after uploading (for every guild member). This is due to the bot caching the links to images that are uploaded with the special tags (the double curly brackets {{}}).


For attaching normal links, just put them in the url option, if will then be shown as attachment in your todo list.

</details>
<details>
<summary>tutorial</summary>

# /tutorial
> Get a short tutorial on how to use the bot.

</details>
<details>
<summary>var</summary>

# /var
> Set, view, edit and delete configvariables. Use them in your tags like so: <%foo%> to be replaced with the variable 'foo' 

# Subcommands

## /var create 

| Name  | Description                             | Type          | Required? |
| :---- | :-------------------------------------- | :------------ | :-------- |
| name  | How you want your variable to be named. | String (Text) | ✔️         |
| value | The value your variable should hold.    | String (Text) | ✔️         |
## /var view 

No arguments required. Description: 
> Show your already registered variables 
## /var edit 

| Name  | Description                           | Type          | Required? |
| :---- | :------------------------------------ | :------------ | :-------- |
| name  | Name of the variable you want to edit | String (Text) | ✔️         |
| value | The new value for your variable       | String (Text) | ✔️         |
## /var delete 

| Name | Description                             | Type          | Required? |
| :--- | :-------------------------------------- | :------------ | :-------- |
| name | Name of the variable you want to delete | String (Text) | ✔️         |



</details>
<details>
<summary>vote</summary>

# /vote
> If you like the bot vote for it!

</details>


<!--ENDCMDSECTION-->

<br>

# 🔐 Permissions

There are 2 permission levels: `USER` and `STAFF`. They are determined by roles.

To set the role, use the settings command like so:

(yes multiple roles are allowed)

![permissions demo](https://github.com/shitcorp/TODOBOT/raw/main/assets/gifs/permissions.gif)

To remove a role from the user of staffroles array just use the `/settings remove userrole: | staffrole:` command

<br>

# ⌨️ Custom Commands / Tags

Tags are a way to essentially build your own custom commands. Let the bot learn new tags by using the `/tag learn` command.

Delete a custom command by using the `/tag unlearn` command followed by the name of your tag.

<details>
<summary>Click to see the custom commands in action</summary>

![tag command demo video](https://github.com/shitcorp/TODOBOT/raw/main/assets/gifs/tagcmd_demo.gif)

</details>

<br>

## **Placeholders**

<details>
<summary>Click here to read about placeholders in custom commands</summary>

Placeholders are words that you can place inside your tags, that will be replaced with a certain value, when the custom command is run.

Available Placeholders:

```diff
+ <MEMCOUNT> => Will be rpelaced with the membercount of the current guild
+ <JOIN_POS> => Will be replaced by the join position of the message author
+ <EMBED> => Will generate an embed with your tag message. Optional Parameters are <COLOR> BLUE </COLOR>, (make sure to include a space after the color tags) <IMG> img.todo-bot.xyz/bliDnJn </IMG>, <THUMB> img.todo-bot.xyz/bZLhbHl </THUMB>
+ <PROCESSED> => Will be replaced with the amount of processed tasks by the message author
+ <SUBMITTED> => Will be replaced with the amount of submitted tasks by the message author
+ <MSG_AUTHOR> => Will tag the message author
+ <MSG_AUTHOR_ID> => Will be replaced with the message author id
+ <MSG_AUTHOR_NAME> => Will be replaced with the message authors username, so in my case "MeerBiene"
+ <MSG_AUTHOR_TAG> => Will be replaced with the message authors tag, so in my case "MeerBiene#7060"
+ <GUILD_NAME> => Will be replaced with the guilds name where the message was sent
```

**Notes:**

- All placeholders are ignorecase, so you can use them like `<join_pos>` or `<guild_name>`

- You can combine all the placeholders, so you can use the `<guild_name>` placeholder within an embed

</details>

<br>

## **Variables**

<details>
<summary>Click here to read about variables in custom commands</summary>

Variables are a way to store key-value pairs for your guild/server, so you can use them in your tags. This is useful if you have a discord for lets say a game server where the ip could change. To follow our example, we would create a variable called `ip` and store the ip adress:

![variable command demo](https://github.com/shitcorp/TODOBOT/raw/main/assets/gifs/vars_demo.gif)

</details>

<br>

# 🔔 Reminders

![reminder command demo](https://github.com/shitcorp/TODOBOT/raw/main/assets/gifs/reminder_cmd_demo.gif)

Note:

- **The lowest possible time is 1m (1 Minute)!**

## **Mentions**

If you want to mention certain users or roles when the reminder finished, just mention them in the reminders content when creating a new reminder.

## **Repeating reminders**

For repeating reminders, simply set the `loop` property to true when creating the reminder. **Keep in mind that the lowest possible time for repeating reminders is 1 hour!**

<br>

# 😇 Support the developer(s)

If you like this bot and or it helps you, consider leaving a star ⭐ here on github. If you want to donate you can do so vide github sponsors. Your profile or organization will then be placed below.

**Sponsors(0)**:

<br>

# 👥 Contributors:

All contributions are welcome! Wheter its just submitting bugs and/or requesting features, or contributing to the codebase directly via pull requests.

For information on the development setup, check out the [contributing guidelines](https://github.com/shitcorp/TODOBOT/tree/main/.github/CONTRIBUTING.md).

All Contributors will be listed below:

![Contributors Display](https://badges.pufler.dev/contributors/shitcorp/TODOBOT?size=50&padding=5&bots=false)

- Julian Puffler [Github](https://github.com/puf17640) | _Code Contributor_
- Husky [Github](https://github.com/Huskydog9988) | _Code Contributor, Feedback giver_
- Oldmagic [Github](https://github.com/oldmagic) | _Code Contributor, Translator 🇸🇪_

**If you are reading this, I still need help with localization(language support), if you want to help, join the [Support Discord](https://discord.gg/RuEdX5T) and ping me.**

<br>

<h1>
<a href="https://discord.gg/RuEdX5T">
<img src="https://img.shields.io/discord/710022036252262485?style=for-the-badge"/>
Support Discord
💬
</a>
</h1>

Whether you need help with the bot, want to try the bot and see it in action, want to suggest new features, or just want to flame me for my bad code, join the support server with the button above.

You can also use Github Issues if you dont want to join the discord.

Theres also a `/suggest` command for sending suggestions to the support server where ppl can up or downvote them.

I also do regular votes on new features in there, so if you want to have a say in the features that will be implemented, you know what to do.
