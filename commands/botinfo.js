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
      e.setTitle("<:lovekanji:776966204815704116> | Informações sobre "+message.client.config.bot.botname+"")
      e.setDescription("Hiroshi é um bot com diversas funcionalidades, para facilitar os servidores diversos")
      e.addField("<:slow:774038837558902824> | Data de criação", "**`07/01/2021`**", true)
      e.addField("<a:rikka_config:777876040012791849> | Servidores", "**`"+message.client.guilds.cache.size+"`**", true)
      e.addField("<a:rikka_sparkles:777878055762526239> | Comandos", "**`"+message.client.commands.size+"`**", true)
      e.addField("<a:rikka_moon:777886530651947048> | Linguagem", "**`NodeJS`**", true)
      e.addField("<:rikka_bot:777874385762648074> | Livraria", "**`Discord.JS`**", true)
      e.addField("<:developer:775811281335615488> | Criadores", "**`"+message.client.config.bot.creatorname+"`**", true)
      e.setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }))
    message.channel.send(e)
  
  }
}

module.exports = Botinfo;