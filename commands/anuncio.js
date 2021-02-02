// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Anuncio extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "anuncio",
      category: "Mod",
      enabled: true,
      aliases: ["anuncio", "announcement", "anúncio", "anunciar"],
      owner: false
    });
  }
  async run(message, args, Discord) {

    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
        const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;

    let embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
      .addField("`"+prefix+"anuncio`", '**Mande um anúncio para um canal em forma de embed.**')
      .addField('Como utilizar?', "`"+prefix+"anuncio` `<Canal>` `<Descrição do anúncio>`")
      .addField('Permissão?', '**`Gerenciar Canal`**', true)
      .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));

    const text = args.slice(1).join(' ');
    if(!text){
        return message.channel.send(embed);
    }
    if(text.length > 1030){
        return message.channel.send(embed);
    }

    let mention = "";
    let canal = message.mentions.channels.first() || message.client.guilds.cache.get(message.guild.id).channels.cache.get(args[0])
    if(!canal) {
        return message.channel.send(embed);
    }

    let embedmention = new Discord.MessageEmbed()
    .setColor("BLACK")
    .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
    .setDescription("Deseja notificar `@everyone` (Ping global)?\n \n Se deseja escreva: Sim.\n Se não deseja escreva: Não.")
    .setThumbnail(message.client.user.displayAvatarURL())
    .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));
            
    const msg = await message.channel.send(embedmention);

    const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 240000 });
        
    collector.on("collect", async (tmsg) => {

        if(tmsg.content.toLowerCase() === "Não".toLowerCase()){
            tmsg.delete();
            msg.delete();
            collector.stop(true);
        }
        
        if(tmsg.content.toLowerCase() === "Sim".toLowerCase()){
            tmsg.delete();
            msg.delete();
            mention = "@everyone";
            collector.stop(true)
        }
    });

    collector.on("end", (collected, reason) => {

        const embed = new Discord.MessageEmbed()
            .setTitle("Anúncio de "+message.guild.name+"")
            .setColor("BLACK")
            .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(text);
        
       canal.send(mention, embed);
      });
    });
  }
}

module.exports = Anuncio;
