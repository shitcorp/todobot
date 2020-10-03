# Help

If someone runs the help command x amount of times in the same guild in a small amount of time, display a special help embed that explains the bot in all detail and shows them how to get more help.

# Manual System

Im thinking of making something like a manual that pull its information from github or gitbook, so theres only onecentral place to get documentation/help.

# Tagsystem

- Events for tags. For example:
~~~
<EVENT> guildMemberAdd </EVENT> => will trigger the tag with this in it
~~~

- Triggers for tags. These are strings or words, that will trigger the tag. For example: 
~~~
<TRIGGER> triggerword1; trigger string or sentence </TRIGGER>
~~~

- option to edit tags after saving them




### new Placeholders:
- <MSG_AUTHOR> => @MeerBiene (mention)
- <MSG_AUTHOR_ID> => 5724756289438
- <MSG_AUTHOR_NAME> => MeerBiene
- <MSG_AUTHOR_TAG> => MeerBiene#7060

- <GUILD_NAME> => guildname

- Configvariables: These are key-value pairs that you can use in tags, they are saved in the config for your guild and can be used like <%VARNAME%> inside the tag.

# Channel white and blacklisting

- Add the option to black- or whitelist channels and users from bots usage (I did the blacklisting already only whitelisting is missing)

# Suggestions:

soom TM

# Github Intagration

I was thinking of making something like a small express API that accepts post requests, so you can give github that webhook url and we can have an issue integration. idk this was just a quick idea i had. If we wanted to take this to a new level we should look into a notion/trello integration as well 