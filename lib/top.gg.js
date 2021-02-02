const DBL = require("dblapi.js");

module.exports = {
    
	/**
     * Starts to post stats to DBL
     * @param {object} client The Discord Client instance
     */
	init(client){
		if(client.config.api.dbl && client.config.api.dbl !== ""){
			const stats = new DBL(client.config.api.dbl, client);
			setInterval(function(){
				stats.postStats(client.guilds.cache.size);
			}, 60000*10); // every 10 minutes
			const dbl = new DBL(client.config.apiKeys.dbl, { webhookPort: client.config.vote.port, webhookAuth: client.config.vote.password });
			dbl.webhook.on("vote", async (vote) => {
				const dUser = await client.users.fetch(vote.user);
        
        let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(client.config.bot.botname, dUser.displayAvatarURL())
        .setTitle("<:lovekanji:776966204815704116> | Obrigado por votar!")
        .setDescription("Agradeço por está sendo uma pessoa maravilhosa e me ajudar a cada dia a crescer e prosperar no Discord, saiba que eu e meu dono agradeçemos.")
        .setFooter("Obrigado "+dUser.username+"",  dUser.displayAvatarURL({ dynamic: true })) 
				dUser.send(embed).catch(() => {});
		}
	}
};
