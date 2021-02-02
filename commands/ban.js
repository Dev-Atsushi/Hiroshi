// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Ban extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "ban",
      category: "Mod",
      enabled: true,
      aliases: ["banir", "ban"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `"+prefix+"ban`", '**Utilize para banir um membro.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"ban` `<Membro>` `<Razão>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Banir Membros`**', true)
        .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true })) 
  
  
      if(!message.member.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(embed)
      }   
      
      if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(embed)
      }
  
      const user = await message.client.resolveMember(args[0], message.guild);
      
      if(!user) {
        return message.channel.send(embed)
      }
      if(!user.id === message.author.id){
        return message.channel.send("**<:rikka_no:777511967362646037> | Você não pode se banir!**");
      }  
    
      const member = message.guild.members.fetch(user.id).catch(() => {});
      
      if(!member) {
        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
    
  	    if(!message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
	        return message.channel.send("**<:rikka_no:777511967362646037> | Você não pode banir o dono ou alguém maior que sua hierarquia!**")
		    }
		  }
  
      let reason = args.slice(1).join(' '); 
      
      if(!reason) {
        reason = "Nenhuma razão fornecida."
      };
  
      var banembed = new Discord.MessageEmbed()
        .setDescription(`**<a:rikka_blobcatban:777579991969693696>・${user} foi Banido!**`)
        .setColor("RANDOM")
        .addField(`**<:lovekanji:776966204815704116>・Razão**`, `**Razão: ${reason}**`,true)
        .addField(`**🔨・Staff**`, `**${message.author}**`, true)
        .setThumbnail(user.user.displayAvatarURL())
        .setImage("https://cdn.discordapp.com/attachments/743826730514514030/803258576117170176/3_Sem_Titulo_20210125104224.png")
        .setFooter(user.id, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
  
      await message.guild.member(user).ban({
        reason: `Banido por ${message.author.username} | Por: ${reason}`
      }).then(async function() {
        let bref = message.client.Database.ref(`Servidores/PunishChannels/${message.guild.id}`)
        
        message.client.Database.ref(`Servidores/PunishChannels/${message.guild.id}`).once('value').then(async function(db) {
          const canal = db.val().channel
            message.guild.channels.cache.get(canal).send(banembed)
        })
      }).catch(err => {
        message.channel.send(`<:rikka_no:777511967362646037>・Não consegui banir ${user}`)
      })
    })
  }
 }

module.exports = Ban;