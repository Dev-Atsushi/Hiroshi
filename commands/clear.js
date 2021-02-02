// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Clear extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "clear",
      category: "Mod",
      enabled: true,
      aliases: ["clear", "purge", "limpar"],
      owner: false
    });
  }
  async run(message, args, Discord) {
  
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      let prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("`"+prefix+"clear`", '**Limpa mensagens de um canal.**')
        .addField('Como utilizar?', "`"+prefix+"clear` `<Quantidade de mensagens>`")
        .addField('Permissão?', '**`Gerenciar Mensagens`**', true)
        .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true })) 
  
      if(!message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.channel.send(embed)
      }
      
      if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        return message.channel.send(embed)
      }
      
      let deleteCount = args[0];
      
      if(!deleteCount || isNaN(deleteCount) || parseInt(deleteCount) < 1) {
        return message.channel.send(embed)
      }
      
      let fetched = await message.channel.messages.fetch({ limit: 100 });
      fetched = fetched.array();
      
      if(fetched.length > deleteCount){
        fetched.length = parseInt(deleteCount, 10);
      }
      fetched = fetched.filter((m) => !m.pinned);
		  deleteCount++;

      message.channel.bulkDelete(fetched, true)
      })
  }
}

module.exports = Clear;
