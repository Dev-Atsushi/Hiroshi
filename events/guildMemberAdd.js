const Discord = require("discord.js");
const firebase = require("firebase");

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run (member) {

  this.client.Database.ref(`Servidores/Autorole/${member.guild.id}`)
    .once("value")
    .then(db => {
      let role = db.val().role;
      if (!role) return;
      if (role) member.guild.members.cache.get(member.user.id).roles.add(role);
    });
  };
};
