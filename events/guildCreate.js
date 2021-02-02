const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild) {

  let dono = guild.owner

  let embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(this.client.config.bot.botname, this.client.user.displayAvatarURL())
    .setTitle("<:lovekanji:776966204815704116> | Configure seu servidor:")
    .setDescription("Entre em meu website para customizar seu servidor.\n [Clique aqui para entrar na dashboard]("https://"+this.client.config.url) ・ <a:estrelastar:769621593122537512>")
    .addField('<:rikka_warn:777512813068419134> | Permissão?', '**`Dono do servidor`**', true)
    .setFooter("Obrigado por me convidar " + dono.user.username, dono.user.avatarURL({
      dynamic: true
    }))

  dono.send(embed)

  };
};
