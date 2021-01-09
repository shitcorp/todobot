exports.run = async (client, message, args, level) => {

  const flags = message.flags
  const conf = await client.getconfig(message.guild.id)
  
  console.log(conf, conf.vars)

  if (!args[0] || !flags[0]) message.channel.send("Helptext, do later")

  if (flags.length > 0) {
    //use flags for command
  };

  if (args.length > 0) {
    //use args for command
  };
  


};

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: ["var", "vars"],
    permLevel: "STAFF"
};

exports.help = {
    name: "configvar",
    category: "Utility",
    description: "Set, view, edit and delete configvariables.",
    usage: "bug <describe your bug here> \n__Example:__\n> //bug The render command is not working pls fix."
};