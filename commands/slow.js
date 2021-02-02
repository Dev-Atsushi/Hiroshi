// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Slow extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "slow",
      category: "Mod",
      enabled: true,
      aliases: ["slow", "modolento"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `"+prefix+"slow`", '**Sete o modo lento.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"slow` `<Tempo>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Gerenciar Canal`**', true)
        .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));

      if(!message.member.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(embed)
      }

      if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(embed)
      }

      if(isNaN(args[0])) {
        return message.channel.send(embed)
      }

      message.channel.setRateLimitPerUser(args[0])
        return message.channel.send(`<:slow:774038837558902824>・Slowmode definido para ${args[0]} segundos!`)
    })
  }
}

module.exports = Slow;