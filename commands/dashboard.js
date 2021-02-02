// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Dashboard extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "dashboard",
      category: "Util",
      enabled: true,
      aliases: ["dashboard", "config"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    let embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
      .setTitle("Configure seu servidor:")
      .setDescription("Entre em meu website para customizar seu servidor.\n [Clique aqui para entrar na dashboard](https://"+message.client.config.url+") ・ <a:estrelastar:769621593122537512>")
      .addField('Permissão?', '**`Dono do servidor`**', true)
      .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true })) 
    message.channel.send(embed)
    
  }
}

module.exports = Dashboard;
