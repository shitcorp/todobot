<h1 align="center"> TODO Bot for  Discord  </h1>

<h4 align="center">
<a href="https://discord.com/oauth2/authorize?client_id=710225677974241431&permissions=67497040&scope=applications.commands%20bot">
    <img src="https://img.shields.io/badge/Add%20Bot-7289DA.svg?style=for-the-badge"/>
</a>

</h4>





## Overwiew

This Bot aims to provide a virtual TODO list inside your discord server. Instead of relying on commands for interacting with the bot, I tried my best to make the most important functions controlled by reactions. 

<br>

### Getting Started

After inviting the Bot to your server, run the command `//setup` (// is the default prefix) and answer the questions the bot asks you. When youre done, run the command `//todo myfirsttodo` and submit your first todo. When the task is posted, you can either edit it by reacting with ✏️ or assign yourself by using the ➕ reaction. When youre done, react with ✅ to mark the task as finished. If you want to post the task in a read-only channel for your members to see, click the ➡️ reaction on the finished task embed.

![todo-cmd-demo](https://cdn.discordapp.com/attachments/724022856740110408/807590728502214696/todo_bot_todo_cmd_demo.gif)

<br>

## Commands

To view all the commands the bot supports, run the `//help` command. If you want to get more specific information about a command run the command `//help` with the command that you want information about as frist argument. So if you wanted to get information about the todo command, you would want to run the command like so: `//help todo`.

Alternatevely, run the command that you want information about with the -h or -help flag, so in the example from above we would just run `//todo -h`.

![help-cmd-demo](https://cdn.discordapp.com/attachments/724022856740110408/807599522997731344/todo_bot_help_cmd_demo.gif)

<br>


## Tags

Tags are a way to essentially build your own commands. Let the bot learn new tags by using the `learn` command like so:

```
//learn example This is an example tag

OR

//learn embedtest <EMBED> This message will be displayed in an embed with the color blue. <COLOR> BLUE </COLOR>

OR

//learn joinposition Your join position is: <JOIN_POS>
```

The command takes in the tag, followed by the description. The tags are then registered like normal commands for your guild.

![Tag Example](https://cdn.discordapp.com/attachments/710020973746716694/754270430134796298/unknown.png)

To unlearn a tag, simple use the `unlearn` command like so:

```
//unlearn example
```

![Unlearn Example](https://cdn.discordapp.com/attachments/710020770369110038/754271780566204446/unknown.png)

To edit a tag use the `edit` command like so:

```
//edit example This is the new description
```

The `edit` command takes in the tag, followed by the new description (yes it will be overwritten.)


<br>

### **Placeholders**

The following placeholders are available:

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
+ All the tags are ignorecase, so you can use the like "<join_pos>" or "<guild_name>"
+ you can combine all the tags, so you can use the "<guild_name>" tag within an embed

<br>

### **Configvariables**

Configvariables are a way to store key-value pairs for your guild/server, so you can use them in your tags. This is usefull if you have a discord for a game server where the ip could change. To follow our example, we would create a variable called "ip" and store the ip adress:

```
//var set ip 127.0.0.1
```

Then we create a tag called "ip" and use the ip variable in there:

```
//learn ip The ip of our server is: <%ip%>
```

If a user then uses the command "//ip" they will get the following output:

```
The ip of our server is: 127.0.0.1
```


<br>

## Reminders


### **Overview**

In V2 I introduced reminders. The reminder command offers 2 flags 

> `-v` to view your open reminders 

and 

> `-c` to create a new reminder. 

To create a new reminder you have to pass in your arguments as follows:

~~~
//reminder -c -1h Food! 
~~~

To edit and or delete reminders, use the `-v` flag and the reaction emojis like so

~~~
//reminder -v
~~~

![reminder_command_todobot.gif](https://cdn.discordapp.com/attachments/710020973746716694/757139558516391966/reminder_command_todobot.gif)

Remember: 

- **Your time has to always be passed in as the second flag!**

- **The lowest possible time is 1m (1 Minute)!**

- **The loop flag or -l has to be passed in as the last flag before the reminders content**



#### **Mentions**

<br>

If you want to mention certain users or roles when the reminder finished, just mention them in the reminders content when creating a new reminder.

Example:

~~~
//reminder -c -1h @SomeUser @SomeOtherUser @SomeRole Get to work!
~~~

#### **Repeating reminders**

<br>

For repeating reminders, simply pass in the `-loop` flag when creating the reminder. **Keep in mind that the lowest possible time for repeating reminders is 1 hour!**

Example:

~~~
//reminder -c -6h -loop Walk the dog!
~~~

<br>

## Support

<a href="https://discord.gg/RuEdX5T">

<img src="https://img.shields.io/discord/710022036252262485?style=for-the-badge"/>

</a>

Whether you need help with the bot, want to try the bot and see it in action, want to suggest new features, or just want to flame me for my bad code, join the support server with the button above.

You can also use Github Issues if you dont want to join the discord.


Theres also a `//suggest` command. It takes in an image as first flag (if you want to attach one), or the -hide flag if you want to hide in which server the suggestion was sent. Either way, the suggestion will end up in the #suggestions channel in the support cord.

I also do regular votes on new features in there, so if you want to have a say in the features that will be implemented, you know what to do.
