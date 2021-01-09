## General Additions

#### - Changed TODO Command:

> The todo command now takes in the tasks title and description, as well as an Image/Media Link, followed by the category as the last argument. Pass them in prefixed as persistent flags like so:

```
//todo ~title ~description ~link ~category [~loop*]

OR

//todo ~title ~category=somecoolcategory

OR

//todo this is a title // this is the content // category // [loop*]

OR

//todo title // category=someothercategory // [loop*]

OR

//todo this is a title; this is the content; category; [loop*]

OR

//todo title; category=someverycreativecategory; [loop*]
```

\*_optional_
_Note: The loop flag has to always be passed in as the last argument of your command!_

#### - Flags and persistent flags

A word about flags and persistent flags.

Flags look like this `-someflag`. To find out what flags a command supports, run the command `//help {commandname}`.

**Its important that the flags are passed in before any arguments are passed in!**

## New Commands

- `//learn`, `//unlearn` and `//edit` as part of the new [Tagsystem.](## Tagsystem)
- `//manual`[`man`*] => Learn more [here](#Manual)
- `//reminder` as part of the new [Remindersystem](##Remindersystem)

\*_The words behind the command in brackets are the aliases of the command._

## Tagsystem

Added a Tagsystem. Tags are a way to basically build your own commands. Let the bot learn new tags by using the `learn` command like so:

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

The following placeholders are available:

```diff
+ <MEMCOUNT> => Will be rpelaced with the membercount of the current guild
+ <JOIN_POS> => Will be replaced by the join position of the message author
+ <EMBED> => Will generate an embed with your tag message. Optional Parameters are <COLOR> BLUE </COLOR>, (make sure to include a space after the color tags) <IMG> img.todo-bot.xyz/bliDnJn </IMG>, <THUMB> img.todo-bot.xyz/bZLhbHl </THUMB>
+ <PROCESSED> => Will be replaced with the amount of processed tasks by the message author
+ <SUBMITTED> => Will be replaced with the amount of submitted tasks by the message author
```

# Manual

Theres now a new manual command, that takes in a commandname and shows you a detailled manual of how to use the command. For example:

```
//manual manual
```

will show you how the manual command is used

## Remindersystem

### Overview:

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



#### Mentions:

If you want to mention certain users or roles when the reminder finished, just mention them in the reminders content when creating a new reminder.

Example:

~~~
//reminder -c -1h @SomeUser @SomeOtherUser @SomeRole Get to work!
~~~

#### Repeating reminders:

For repeating reminders, simply pass in the `-loop` flag when creating the reminder. **Keep in mind that the lowest possible time for repeating reminders is 1 hour!**

Example:

~~~
//reminder -c -6h -loop Walk the dog!
~~~


## Queries

#### Overview:

Queries are a way to query the database to show all tasks, or a limited number of tasks or certain tasks that only the category important.


Queries are structured after the following way
```
//query { DATABASE² } BY_USER¹ @UserMention¹ WHERE { keyword=searchvalue }
```
*¹ Optional*

*² Only DB available right now is "TODOS"*



Allowed Keywords after `WHERE` are:

> - state= { open | assigned | closed}
> - severity= {1 | 2 | 3 | 4 | 5 } [5 is lowest]
> - repeating= { true | false }
> - title= { somestring }
> - content= { somestring }
> - submittedby= { userid }
> - assigned= { userid } 
> - category= { somestring }

#### Examples:

```
//query TODOS WHERE category=important
```

> Shows all tasks with the category important

```
//query TODOS WHERE category=important 20
```

> Shows only 20 results with the category important

```
//query TODOS BY_USER @MeerBiene WHERE category=important
```

> Shows all tasks that were submitted by @MeerBiene and have the category important

```
//query TODOS BY_USER @MeerBiene WHERE category=important 25
```

> Shows 25 tasks that were submitted by @MeerBiene and have the category important

```
//query TODOS BY_USER @MeerBiene WHERE assigned=1234567891011
```

> Shows all tasks submitted by @MeerBiene, that are assigned to the user with the id `1234567891011`

#### Query Rules:

- The command is extremely case sensitive. Make sure to write the keywords like `WHERE` or `BY_USER` in all uppercase.

- The keyword `BY_USER` has to be followed by a usermention

- The search criteria after `WHERE` has to have no spaces between the equal sign and the search value. E.g: `category=important` or `state=open`

- The limiting number has to be the last argument passed in

- You can pass in only one search criteria after the `WHERE` keyword

- The `WHERE` keyword can only be used once in a query
