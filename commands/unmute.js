// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Unmute extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "unmute",
      category: "Mod",
      enabled: true,
      aliases: ["unmute", "desmutar"],
      owner: false
    });
  }
  run(message, args, Discord) {

    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function (db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `" + prefix + "unmute`", '**Desmute alguém.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`" + prefix + "unmute` `<Membro>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Kickar Membros`**', true)
        .setFooter("Comando requesitado por " + message.author.username + "", message.author.displayAvatarURL({
          dynamic: true
        }));

      if(!message.member.hasPermission("KICK_MEMBERS")) {
        return message.channel.send(embed)
      }

      const tomute = await message.client.resolveMember(args[0], message.guild);
      
      if(!tomute) {
        return message.channel.send(embed)
      }

      const bref = message.client.Database.ref(`Servidores/Muterole/${message.guild.id}`)
      message.client.Database.ref(`Servidores/Muterole/${message.guild.id}`).once('value').then(async function (db) {
        let muterole = db.val() ? message.guild.roles.cache.get(db.val().role) : false;
        
        if(!muterole) {
          muterole = await message.guild.roles.cache.find(a => a.name === "🌙・Hiroshi Mute");
          if(!muterole) {
            return message.channel.send('**<:rikka_no:777511967362646037>・Mute alguém primeiro!**')
          }
        }
        
        if(!tomute.roles.cache.has(muterole.id)) {
          return message.channel.send(`**<:rikka_no:777511967362646037>・Mute ${tomute} antes de desmutar!**`);
        }
        
        await message.guild.members.cache.get(tomute.id).roles.remove(muterole)
        return message.channel.send("**<:rikka_unmute:777906839810605087>・<@" + tomute + "> Desmutado. Mute-o com `" + prefix + "mute`**")
      })
    })
  }
}

module.exports = Unmute;