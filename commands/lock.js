// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Lock extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "lock",
      category: "Mod",
      enabled: true,
      aliases: ["lock", "fecharchat", "fechar"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `"+prefix+"lock`", '**Fecha um canal.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"lock` `<Canal>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Gerenciar Canal`**', true)
        .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));
  
      const canal = message.mentions.channels.first() || message.client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.channel;
    
      if(!message.member.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(embed)
      }
      
      if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(embed)
      }
      
      canal.updateOverwrite(canal.guild.roles.everyone, { SEND_MESSAGES: false });
      
        return message.channel.send("<:locking:774036702926602241>・Chat Fechado. Para abrir utilize `"+prefix+"unlock`!")
    })
  }
}

module.exports = Lock;