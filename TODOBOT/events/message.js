const cmdRecently = new Set();


module.exports = async (client, message) => {

  const timeout = process.env.MSG_DELETE || 90000

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let Prefix;
  let settings;

  message.guild ? settings = await client.getconfig(message.guild.id) : null;

  settings  
    ? Prefix = settings.prefix 
    : Prefix = "//";


  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(client.embed(`My prefix on this guild is ${Prefix}`))
      .then(msg => { if (msg.deleteable) msg.delete({ timeout }) })
  }


  if (message.content.indexOf(Prefix) !== 0) return;



  const args = message.content.slice(Prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();


  /**
   *  Begin Taghandler
   */

  // convert settings.tag object into map

  if (settings) {
    
    // Check for blacklisted users here
    if (settings.blacklist_users && Object.values(settings.blacklist_users).includes(message.author.id)) return;
    

    // Check if the message is in a blacklisted channel
    if (settings.blacklist_channels && Object.values(settings.blacklist_channels).includes(message.channel.id)) return;

    
    /**
     * Start Taghandler
     */
    const tags = await client.mapBuilder(settings.tags);
    tags.has(command) ? client.taghandler(message, tags.get(command)) : null;

    /**
     *  End Taghandler
     */

  }


  if (message.guild && !message.member) await message.guild.fetchMember(message.author);


  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;


  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send(client.warning("This command is unavailable via private message. Please run this command in a guild."));



  message.flags = [];
  for (const index in args) {
    while (args[index].startsWith("-")) {
      message.flags.push(args.shift().slice(1));
    }
  }

  message.persists = [];
  for (const index in args) {
    if (args[index].startsWith("~")) message.persists.push(args.shift().slice(1));
  }

  if (message.flags.includes("h") || message.flags.includes("help")) {
    let helpcmd = client.commands.get("help")
    let arg = [command]
    return helpcmd.run(client, message, arg, level)
  }

  // global cooldown here
  if (cmdRecently.has(message.author.id)) {
    return message.reply(client.warning(`Please wait  \`${client.cooldown / 1000}\`  seconds before doing this command again!`)).then(msg => {
      if (msg.deletable) msg.delete({ timeout })
    })
  } else {
    cmdRecently.add(message.author.id)
    setTimeout(() => {
      cmdRecently.delete(message.author.id)
    }, client.cooldown)

    client.logger.cmd(`[CMD] ${message.author.username} (ID: ${message.author.id}) ran the command '${cmd.help.name}', in the guild '${message.guild.name}' (ID: ${message.guild.id})`);
    try {
      cmd.run(client, message, args, level);
    } catch (e) {
      client.logger.debug(e);
    }
  }

}