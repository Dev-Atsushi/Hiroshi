// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Unlock extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "unlock",
      category: "Mod",
      enabled: true,
      aliases: ["unlock", "abrirchat", "abrir"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `"+prefix+"unlock`", '**Abre um canal.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"unlock` `<Canal>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Gerenciar Canal`**', true)
        .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));
  
      const canal = message.mentions.channels.first() || message.client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.channel;
    
      if(!message.member.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(embed)
      }
      
      if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(embed)
      }
      
       canal.updateOverwrite(canal.guild.roles.everyone, { SEND_MESSAGES: true });
       return message.channel.send("<:channel:774040419377479701>・Chat Aberto. Para fechar utilize `"+prefix+"lock`!")
    })
  }
}

module.exports = Unlock;