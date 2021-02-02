// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Unban extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "unban",
      category: "Mod",
      enabled: true,
      aliases: ["desbanir", "unban"],
      owner: false
    });
  }
  async run(message, args, Discord) {

    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
        const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;

    let embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
      .addField("<:rikka_no:777511967362646037> | `"+prefix+"unban`", '**Faça a revogação de um ban.**')
      .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"unban` `<Id do membro banido>`")
      .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Banir Membros`**', true)
      .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));

      if(!message.member.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(embed)
      }   
      
      if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(embed)
      }

      let user = null;

      if(!args[0]){
          return message.channel.send(embed);
      }

      // Check if the arg is an ID or a username
      const isId = !isNaN(args[0]);

      if(isId){
          // Try to find a user with that ID
          await message.client.users.fetch(args[0]).then((u) => {
              // if a user was found
              user = u;
          }).catch(() => {});
      } else if(!isId) {
          const arr = args[0].split("#");
          if(arr.length < 2){
              return message.channel.send(embed)
          }
          user = message.client.users.filter((u) => u.username === arr[0]).find((u) => u.discriminator === arr[1]);
      }

      if(!user){
          return message.channel.send(embed)
      }

      // check if the user is banned
      const banned = await message.guild.fetchBans();
      if(!banned.some((e) => e.user.id === user.id)){
        return message.channel.send('**<:rikka_warn:777512813068419134>・Este membro não foi banido.**')
      }

      // Unban user
      message.guild.members.unban(user).catch(() => {});

      // Send a success message in the current channel
      var banembed = new Discord.MessageEmbed()
      .setDescription(`**<a:rikka_blobcatban:777579991969693696>・Revogado banimento de ${user}**`)
      .setColor("RANDOM")
      .setImage("https://cdn.discordapp.com/attachments/743826730514514030/803258576117170176/3_Sem_Titulo_20210125104224.png")
      .addField(`**🔨・Staff**`, `**${message.author}**`, true)
      .setThumbnail(user.avatarURL())
      .setFooter(user.id, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()

      message.client.Database.ref(`Servidores/PunishChannels/${message.guild.id}`).once('value').then(async function(db) {
        const canal = db.val().channel
          message.guild.channels.cache.get(canal).send(banembed)
      })

    })
  }
}

module.exports = Unban;