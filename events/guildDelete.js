const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild) {

    let bref = await this.client.Database.ref("Servidores/Invite/" + guild.id + "").once("value")
    bref.set(null)

    let bref2 = await this.client.Database.ref(`Servidores/Prefix/${guild.id}`).once("value")
    bref2.set(null)

    let bref3 = await this.client.Database.ref(`Servidores/Autorole/${guild.id}`).once("value")
    bref3.set(null)

    let bref4 = await this.client.Database.ref(`Servidores/PunishChannels/${guild.id}`).once('value')
    bref4.set(null)

    let bref5 = await this.client.Database.ref(`Servidores/Muterole/${guild.id}`).once('value')
    bref5.set(null)

  };
}
