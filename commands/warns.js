// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Warns extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "warns",
      category: "Mod",
      enabled: true,
      aliases: ["warns", "warnlist"],
      owner: false
    });
  }
  run(message, args, Discord) {

    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function (db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `" + prefix + "warns`", '**Veja a quantidade de warns que você deu em um membro.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`" + prefix + "warns` `<Membro>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Kickar Membros`**', true)
        .setFooter("Comando requesitado por " + message.author.username + "", message.author.displayAvatarURL({
          dynamic: true
        }));

      let wUser = await message.client.resolveMember(args[0], message.guild);
      if(!wUser) wUser = message.author;
    
    
      const ref = message.client.Database.ref(`Servidores/Warn/${message.guild.id}/Usuarios/${wUser.id}`)
        message.client.Database.ref(`Servidores/Warn/${message.guild.id}/Usuarios/${wUser.id}`).once('value').then(async function (db) {
    
        const warns = db.val() ? db.val().contagem : 0;
          
        if(!db.val()) message.client.Database.ref(`Servidores/Warn/${message.guild.id}/Usuarios/${wUser.id}`).set({contagem: 0})
    
        let Wmbed = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
          .setDescription("<:lovekanji:776966204815704116> | Aqui está a lista de warns de <@"+wUser+">")
          .addField("<:rikka_warn:777512813068419134>・Warns:", ""+warns+".", true)
          .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true })) 
    
          if(Number(warns) >= 3 && Number(warns) < 5) {
            Wmbed.addField("<:lovekanji:776966204815704116>・Sugestão de punição?", "**`Mute`**", true)
          } else if(Number(warns) >= 5 && Number(warns) < 7) {
            Wmbed.addField("<:lovekanji:776966204815704116>・Sugestão de punição?", "**`Kick`**", true)
          } else if(Number(warns) >= 7 && Number(warns) < 9) {
            Wmbed.addField("<:lovekanji:776966204815704116>・Sugestão de punição?", "**`TempBan`**", true)
          } else if(Number(warns) >= 9) {
            Wmbed.addField("<:lovekanji:776966204815704116>・Sugestão de punição?", "**`Ban`**", true)
          }

        return message.channel.send(Wmbed)
    
       })
     })
   }
}

module.exports = Warns;