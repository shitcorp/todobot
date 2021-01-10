exports.run = async (client, message, args, level) => {

  const conf = await client.getconfig(message.guild.id)
  const variableMap = await client.mapBuilder(conf.vars)

  const commandError = () => {
    return message.channel.send(client.error(`**Something went wrong**
    Heres some info I gathered for you:
    
    __**Command Description:**__
    
    ${client.commands.get("var").help.description}
    
    __**Command Usage/Syntax:**__
    
    ${client.commands.get("var").help.usage}`))
  };

  
  if (message.flags.length > 0) {
    //push flag into arg array and use as arg[0]
    args.splice(0, 0, message.flags[0])
  };

 
  const editFunction = async (args) => {
    variableMap.set(args[1], args[2])
    conf.vars = variableMap;
    await client.updateconfig(message.guild.id, conf);
    message.channel.send(client.success(`Updated the key \`${args[1]}\` and saved the new value \`${args[2]}\``))
  };


  //use args for command
  switch (args[0]) {
    // set a new key value pair
    case "s":
    case "set":
      if (args.length < 3) return commandError();
      if (variableMap.get(args[1]) !== undefined) return message.channel.send(client.error(`This key already exists.`))
      variableMap.set(args[1], args[2])
      conf.vars = variableMap;
      await client.updateconfig(message.guild.id, conf)
      message.channel.send(client.success(`Saved your new configvariable with the key \`${args[1]}\` and the value \`${args[2]}\` `))
      break;
    // view key value pair by key (maybe add -all flag)
    case "v":
    case "view":
      variableMap.has(args[1]) ? message.channel.send(client.coloredEmbed(`The configvariable \`${args[1]}\` has the value:  \`${variableMap.get(args[1])}\``, "YELLOW"))
        : message.channel.send(client.error(`This key does not seem to exist`));
      break;
    // edit key value pair
    case "e":
    case "u":
    case "edit":
    case "update":
      if (args.length < 3) return commandError();
      variableMap.has(args[1]) ? editFunction(args)
        : message.channel.send(client.error(`This key does not seem to exist`));
      break;
    // delete key value pair by key
    case "d":
    case "del":
      if (args.length < 2) return commandError();
      if (!variableMap.has(args[1])) return message.channel.send(client.error(`You can only delete keys that exist`))
      variableMap.delete(args[1])
      conf.vars = variableMap;
      await client.updateconfig(message.guild.id, conf)
      message.channel.send(client.success(`Deleted the key \`${args[1]}\``))
      break;
  }





};

exports.conf = {
  enabled: true,
  guildOnly: true,
  party: false,
  aliases: ["vars", "configvar"],
  permLevel: "STAFF"
};

exports.help = {
  name: "var",
  category: "Utility",
  flags: [
    '-s => Set a new configvariable',
    '-v => View a configvariable by key',
    '-e => Edit a key-value pair by key',
    '-d => Delete a key-value pair by key'
  ],
  description: "Set, view, edit and delete configvariables. Use them in your tags like so: <%foo%> to be replaced with the variable 'foo'",
  usage: `__**Syntax**__
  //var -s/set foo bar => Saves a new key-value pair with the key foo and the value bar
  
  //var -v/view foo => Returns "bar", the value of foo
  
  //var -u/update/-e/edit foo newbar => Updates foo to the new value "newbar"
  
  //var -d/del foo => Deletes foo`

};