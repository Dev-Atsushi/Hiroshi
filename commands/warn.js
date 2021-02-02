// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Warn extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "warn",
      category: "Mod",
      enabled: true,
      aliases: ["warn", "avisar"],
      owner: false
    });
  }
  run(message, args, Discord) {

    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function (db2) {
      let prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `" + prefix + "warn`", '**Avise algum membro.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`" + prefix + "warn` `<Membro>` `<Razão>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Kickar Membros`**', true)
        .setFooter("Comando requesitado por " + message.author.username + "", message.author.displayAvatarURL({
          dynamic: true
        }));

      if(!message.member.hasPermission("KICK_MEMBERS")) {
        return message.channel.send(embed)
      }

      let wUser = await message.client.resolveMember(args[0], message.guild);  
      
      if(!wUser) { 
        return message.channel.send(embed) 
      }
      
      if(wUser === message.author) {
        return message.channel.send("**<:rikka_no:777511967362646037> | Você não pode se avisar.**")
      }

      const reason = args.join(" ").slice(22);
    
      if(!reason) { 
        return message.channel.send(embed)
      }
    
    
      const ref = message.client.Database.ref(`Servidores/Warn/${message.guild.id}/Usuarios/${wUser.id}`)
        message.client.Database.ref(`Servidores/Warn/${message.guild.id}/Usuarios/${wUser.id}`).once('value').then(async function (db) {
    
        let warns = db.val() ? db.val().contagem : 0;
          
        if(!db.val()) message.client.Database.ref(`Servidores/Warn/${message.guild.id}/Usuarios/${wUser.id}`).set({contagem: 0})
    
        ref.update({
          contagem: Number(warns) + Number(1)
        })
    
        var Wembed = new Discord.MessageEmbed()
         .setDescription(`**<a:rikka_blobcatban:777579991969693696>・${wUser} foi Avisado!**`)
         .setColor("RANDOM")
         .addField(`**<:lovekanji:776966204815704116>・Razão**`, `**Razão: ${reason}**`, true)
         .addField(`**🔨・Staff**`, `**${message.author}**`, true)
         .setImage("https://cdn.discordapp.com/attachments/743826730514514030/803258576117170176/3_Sem_Titulo_20210125104224.png")
         .setThumbnail(wUser.user.avatarURL())
         .setFooter(wUser.user.id, message.author.displayAvatarURL({ dynamic: true }))
         .setTimestamp()
    
        const bref = message.client.Database.ref(`Servidores/PunishChannels/${message.guild.id}`)
          message.client.Database.ref(`Servidores/PunishChannels/${message.guild.id}`).once('value').then(async function(db) {
            const canal = db.val().channel
            
             message.guild.channels.cache.get(canal).send(Wembed)
       })
      })
    })
  }
}

module.exports = Warn;