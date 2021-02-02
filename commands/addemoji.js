// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Addemoji extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "addemoji",
      category: "Mod",
      enabled: true,
      aliases: ["addemoji", "adicionaremoji"],
      owner: false
    });
  }
  run(message, args, Discord) {
      
    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
       const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
      
       let erro = new Discord.MessageEmbed()
         .setColor("BLACK")
         .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
         .addField("<:rikka_no:777511967362646037> | `"+prefix+"addemoji`", '**Adicione um emoji.**')
         .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"addemoji` `<Nome do emoji>` `<Link do emoji>`")
         .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Gerenciar Canal`**', true)
         .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));

       if(!message.member.hasPermission("MANAGE_EMOJIS")) {
         return message.channel.send(erro).then(msg => {
           setTimeout(() => {
             msg.delete()
           }, 5000)
         }); 
       };
  
       if(!message.guild.me.hasPermission("MANAGE_EMOJIS")) {
         return message.channel.send(erro).then(msg => {
           setTimeout(() => {
             msg.delete()
           }, 5000)
         }); 
       }
  
       if(!args[1]) {
         return message.channel.send(erro).then(msg => {
           setTimeout(() => {
             msg.delete()
           }, 5000)
         }); 
       };
        
       if(!args[0]) {
         return message.channel.send(erro).then(msg => {
           setTimeout(() => {
             msg.delete()
           }, 5000)
         }); 
       };
      
       message.guild.emojis.create(args[1], args[0]).then(emoji => {
         return message.channel.send(`**${emoji.toString()} | Foi adicionado ao servidor.**`);
       }).catch((err) => {
         console.log(err)
         if(err.code === 30008) {
           return message.channel.send("**<:rikka_no:777511967362646037>・O máximo de emojis deste server foi atingido.**")
         }
         if(err.code === 50035) {
           return message.channel.send("**<:rikka_no:777511967362646037>・Este emoji é muito grande.**")
         }
         return message.channel.send("**<:rikka_no:777511967362646037>・URL ou nome é inválido.**")
         });
    });
  };
};

module.exports = Addemoji;