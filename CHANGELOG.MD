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
```
**optional*

#### - Flags and persistent flags

## New Commands


+ `//learn`, `//unlearn` and `//edit` as part of the new [Tagsystem.](## Tagsystem)
+ `//manual`[`man`*] => Learn more [here](#Manual)
+ `//reminder` as part of the new [Remindersystem](##Remindersystem)

**The words behind the command in brackets are the aliases of the command.*



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
+ <REPLY> => Will reply to the mentioned user
+ <EMBED> => Will generate an embed with your tag message. Optional Parameters are <COLOR> BLUE </COLOR> (make sure to include a space after the color tags)
+ <PROCESSED> => Will be replaced by the amount of processed tasks of the message author
```

# Manual

Theres now a new manual command, that takes in a commandname and shows you a detailled manual of how to use the command. For example:
```
//manual manual 
```
will show you how the manual command is used

## Remindersystem