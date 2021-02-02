const Discord = require("discord.js"),
      chalk = require("chalk");

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run () {
    const client = this.client;
    
  let activities = [
    `💥・Meu prefixo "+client.config.prefix+"`,
    `👋・Website "+client.config.url+"`
  ],
  i = 0;
  setInterval(
    () =>
    client.user.setActivity(`${activities[i++ % activities.length]}`, {
      type: "STREAMING",
      url: "https://www.twitch.tv/ykyummikunyk"
    }),
    5000
  );
  console.log(chalk.magenta("⚡️・Hiroshi Online"));
    		setTimeout(() => {
			    console.log(chalk.yellow("💥・Estou em "+client.guilds.cache.size+" Servidores・💥"));
		    }, 30000);
  };
};
