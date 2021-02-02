// Import base command
const Base = require("../base/Command"),
ms = require("ms");

// Create a class for the command that extends the base command
 class Mute extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "mute",
      category: "Mod",
      enabled: true,
      aliases: ["mute", "mutar"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
    let embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
      .addField("<:rikka_no:777511967362646037> | `"+prefix+"mute`", '**Muta algum membro.**')
      .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"mute` `<Membro>` `<Razão>`")
      .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Kickar Membros`**', true)
      .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));
  
    if(!message.member.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(embed)
    }
  
    const tomute = await message.client.resolveMember(args[0], message.guild);  

    if(!tomute) {
      return message.channel.send(embed) 
    }
  
      message.client.Database.ref(`Servidores/Muterole/${message.guild.id}`).once('value').then(async function(db) {
        let muterole = db.val() ? message.guild.roles.cache.get(db.val().role) : "não";
        if (!muterole) muterole = "não"

        if(muterole === "não") {
          try {
            muterole = message.guild.roles.cache.find(a => a.name === "🌙・Hiroshi Mute");
            if(!muterole) {
              muterole = await message.guild.roles.create({
                data: {
                  name: "🌙・Hiroshi Mute"
                },
              });
              muterole.setPermissions(0)
            }
            message.guild.channels.cache.forEach(async canais => {
              await canais.updateOverwrite(muterole, { 
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              })
            })
          } catch(err) {
            console.log(err)
          }
        }

        let reason = args.slice(1).join(' ')
        
        if(!reason) {  
          reason = "Razão não fornecida."
        }

        let muteembed = new Discord.MessageEmbed()
          .setDescription(`**<:mutado:774037272478744616>・${tomute} foi Mutado!**`)
          .setColor("RANDOM")
          .addField(`**<:lovekanji:776966204815704116>・Razão**`, `**Razão: ${reason}**`, true)
          .addField(`**🔨・Staff**`, `**${message.author}**`, true)
          .setThumbnail(tomute.user.displayAvatarURL())
          .setImage("https://cdn.discordapp.com/attachments/743826730514514030/803258576117170176/3_Sem_Titulo_20210125104224.png")
          .setFooter(tomute.id, message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
      
          await message.guild.members.cache.get(tomute.id).roles.add(muterole.id);
      
          message.client.Database.ref(`Servidores/PunishChannels/${message.guild.id}`).once('value').then(async function(db) {
            const canal = db.val().channel
              message.guild.channels.cache.get(canal).send(muteembed)
            })
      })
    })
  }
}

module.exports = Mute;