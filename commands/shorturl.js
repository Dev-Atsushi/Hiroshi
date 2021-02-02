// Import base command
const Base = require("../base/Command"),
fetch = require("node-fetch");

// Create a class for the command that extends the base command
 class Shorturl extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "shorturl",
      category: "Util",
      enabled: true,
      aliases: ["shorturl", "minimizeurl"],
      owner: false
    });
  }
  async run(message, args, Discord) {

    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
        const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
    
    let erro = new Discord.MessageEmbed()
    .setColor("BLACK")
    .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
    .addField("<:rikka_no:777511967362646037> | `"+prefix+"shorturl`", '**Encurte um url.**')
    .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"shorturl` `<Url>`")
    .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }));

    const url = args[0];
		if(!url){
			return message.channel.send("**<:rikka_warn:777512813068419134>・Específique um url (link).**");
		}

		const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURI(url)}`);
		const body = await res.text();

		if(body === "Error: Please enter a valid URL to shorten"){
			return message.channel.send("**<:rikka_warn:777512813068419134>・Específique um url (link) válido.**");
		}

		const embed = new Discord.MessageEmbed()
    .setColor("BLACK")
    .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
    .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }))
		.setDescription("<:lovekanji:776966204815704116>・Aqui está seu url minimizado: "+body+"");
		message.channel.send(embed);

   })
 }
}

module.exports = Shorturl;