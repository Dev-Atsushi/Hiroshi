// Import base command
const Base = require("../base/Command"),
ms = require("ms");

// Create a class for the command that extends the base command
 class Giveaway extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "giveaway",
      category: "Mod",
      enabled: true,
      aliases: ["sorteio", "gway"],
      owner: false
    });
  }
  run(message, args, Discord) {
  
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
      let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("`"+prefix+"giveaway`", '**Faça um sorteio.**')
        .addField('Como utilizar?', "`"+prefix+"giveaway` `<Tempo>` `<Prêmio>`")
        .addField('Permissão?', '**`Gerenciar Servidor`**', true)
        .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));

      if(!message.member.hasPermission("MANAGE_GUILD")) {
        return message.channel.send(embed)
      }

      const time = args[0];
      if(!time){
        return message.channel.send(embed)
      }
      if(isNaN(ms(time))) {
          return message.channel.send('Específique um tempo válido.')
      }
      if(ms(time) > ms("15d")) {
        return message.channel.send('Específique um tempo menor de 15 dias.')
      }
      
      const prize = args.slice(1).join(" ");
      if(!prize) {
          return message.channel.send(embed)
      }

      message.client.giveawaysManager.start(message.channel, {
        time: ms(time),
        prize: prize,
        winnerCount: 1,
        messages: {
            embedColor: `#decf28`,
            timeRemaining: "Acaba às {duration}",
            inviteToParticipate: `<a:rikka_sparkles:777878055762526239>・**Participe com \`🎉\`**`,
            winMessage: "**{winners}, você ganhou {prize}!**",
            noWinner: "🚫・Sem participantes!",
            embedFooter: ``,
            winners: "Ganhador",
            endedAt: "Acaba a",
            units: {
                seconds: "segundos",
                minutes: "minutos", 
                hours: "horas",
                days: "dias",
                pluralS: false
            }
        }    
      })
    })
  }
}

module.exports = Giveaway;
