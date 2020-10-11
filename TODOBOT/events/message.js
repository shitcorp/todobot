const cmdRecently = {};

module.exports = async (client, message) => {
  const timeout = process.env.MSG_DELETE_THRESHHOLD;
  if (message.author.bot || message.channel.type === 'dm') return;  
  let settings, prefix;

  if (message.guild) {
    settings = await client.getConfig(message.guild.id);
  }
  prefix = settings.prefix || process.env.PREFIX || '//';

  console.log(message.member.hasPermission('MANAGE_GUILD'));

  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) 
    return message.reply(client.embed(`My prefix on this guild is ${prefix}`))
      .then(msg => { if (msg.deleteable) msg.delete({ timeout }) });

  if (!message.content.trim().startsWith(prefix)) return;

  const args = message.content.substr(prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

  if (settings) {
    if(settings.tags[command])
      client.tagHandler(message, check);

     // Check for blacklisted users here
     if (settings.blacklist_users) {
       let blacklist = Object.values(settings.blacklist_users);
       if (blacklist.includes(message.author.id)) return;
      }

      if (settings.blacklist_channels) {
        blacklist = Object.values(settings.blacklist_channels);
        if (blacklist.includes(message.channel.id)) return;
      }      
  }

  if (message.guild && !message.member) 
    await message.guild.fetchMember(message.author);

  const level = client.permLevel(message);
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;

  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send(client.warning('This command is not available via DM. Please run this command in a guild.'));

  if (level < client.levelCache[cmd.conf.permLevel])
    return message.channel.send(client.warning(`You do not have permission to use this command.
    > Your permission level is **${client.permLevels[level].name}**
    > This command requires **${cmd.conf.permLevel}**`)).then(msg => {
      if (msg.deletable) msg.delete({ timeout })
    })

  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === '-') {
    message.flags.push(args.shift().slice(1));
  }

  message.persists = [];
  while (args[0] && args[0][0] === '~') {
    message.persists.push(args.shift().slice(1));
  }

  if (cmdRecently[message.author.id]) {
    return message.reply(client.warning(`Please wait  \`${client.config.cooldown / 1000}\`  seconds before doing this command again!`))
      .then(async (msg) => msg.deletable && await msg.delete({ timeout }));
  } else {
    cmdRecently[message.author.id] = true;
    setTimeout(() => delete cmdRecently[message.author.id], client.config.cooldown)
    client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (ID: ${message.author.id}) ran the command '${cmd.help.name}', in the guild '${message.guild.name}' (ID: ${message.guild.id})`);
    try {
      cmd.run(client, message, args, level);
    } catch (e) {
      client.logger.error(e);
    }
  }
};
