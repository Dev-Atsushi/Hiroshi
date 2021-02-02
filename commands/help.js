// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Help extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "help",
      category: "Util",
      enabled: true,
      aliases: ["ajuda", "help"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    let init = new Discord.MessageEmbed()
      .setColor(`BLACK`)
      .setTitle(`**<a:rikka_moon:777886530651947048>・${message.client.config.bot.botname} Help**`)
      .setDescription("**Me chamo `"+message.client.config.bot.botname+"` um bot para Discord, com funções inovádoras e repletas de alegria para seu servidor**\n \n **<:rikka_link:777887753475194880>・Links**\n <:rikka_server:777874900923711488> | [Servidor de Suporte](https://discord.gg/rg9zkzZyda)\n <:rikka_link:777887753475194880> | [Website](https://hiroshi.tk) \n <:rikka_add:777896091840413778> | [Adicione-me](https://discord.com/api/oauth2/authorize?client_id=776955611212152872&permissions=8&redirect_uri=https%3A%2F%2Fhiroshi.tk&scope=bot)\n \n **<:rikkahelppasta:769605039151906847>・Comandos**\n <:rikkahelpum:769601818061701196> | Moderação\n <:rikkahelpdois:769601901251526737> | Útilidade")
      .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
      .setImage("https://cdn.discordapp.com/attachments/743826730514514030/803063076110204958/Screenshot_20210124-214545.png")
      .setFooter(`Comando requisitado por: ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })) 
      .setThumbnail(message.client.user.displayAvatarURL())

    message.channel.send(init).then(msg => {
      msg.react('769601818061701196')
      msg.react('769601901251526737')
     
      const ModFilter = (reaction, user) => reaction.emoji.id === '769601818061701196' && user.id === message.author.id;
      const UtilyFilter = (reaction, user) => reaction.emoji.id === '769601901251526737' && user.id === message.author.id;
     
      const Mod = msg.createReactionCollector(ModFilter);
      const Utily = msg.createReactionCollector(UtilyFilter);
     
      Mod.on('collect', async r5 => {
        r5.users.remove(message.author.id)
        
        const comandosmod = await message.client.commands.array().filter(ch => ch.help.category === 'Mod');
        let texto = ''
        let embed = new Discord.MessageEmbed()
          embed.setTitle("<:rikka_mod:777514639058796585>・Comandos de Moderação")
          embed.setThumbnail(message.client.user.displayAvatarURL())
          embed.setTimestamp()
          embed.setColor("8be9fd")
          embed.setImage("https://cdn.discordapp.com/attachments/743826730514514030/803063076110204958/Screenshot_20210124-214545.png")
          comandosmod.forEach(async cmd => {
            texto += cmd.help.name.charAt(0).toUpperCase() + cmd.help.name.slice(1) + (comandosmod[comandosmod.length - 1].help.name === cmd.help.name ? '.' : ', ');
          })
          embed.setDescription(texto)
        
        msg.edit(embed)
      })
      
      Utily.on('collect', async r5 => {
        r5.users.remove(message.author.id)
         
        const comandosutil = await message.client.commands.array().filter(ch => ch.help.category === 'Util');
        let texto = ''
        let embed = new Discord.MessageEmbed()
          .setTitle("<a:rikka_sparkles:777878055762526239>・Comandos de Útilidade")
          .setDescription('`Help`')
          .setThumbnail(message.client.user.displayAvatarURL())
          .setTimestamp()
          .setColor("8be9fd")
          .setImage("https://cdn.discordapp.com/attachments/743826730514514030/803063076110204958/Screenshot_20210124-214545.png")
          comandosutil.forEach(async cmd => {
            texto += cmd.help.name.charAt(0).toUpperCase() + cmd.help.name.slice(1) + (comandosutil[comandosutil.length - 1].help.name === cmd.help.name ? '.' : ', ');
          })
          embed.setDescription(texto)
        
        msg.edit(embed)
      })
    })
  }
}

module.exports = Help;