// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Botinfo extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "botinfo",
      category: "Util",
      enabled: true,
      aliases: ["botinfo", "infobot", "info"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    let e = new Discord.MessageEmbed()
      e.setColor("BLACK")
      e.setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
      e.setTitle("Informações sobre "+message.client.config.bot.botname+"")
      e.setDescription(""+message.client.config.bot.botdescription+"")
      e.addField("Data de criação", "**`07/01/2021`**", true)
      e.addField("Servidores", "**`"+message.client.guilds.cache.size+"`**", true)
      e.addField("Comandos", "**`"+message.client.commands.size+"`**", true)
      e.addField("Linguagem", "**`NodeJS`**", true)
      e.addField("Livraria", "**`Discord.JS`**", true)
      e.addField("Criadores", "**`"+message.client.config.bot.creatorname+"`**", true)
      e.setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }))
    message.channel.send(e)
  
  }
}

module.exports = Botinfo;
