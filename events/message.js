const Discord = require("discord.js");
const config = require("../config.js");
const cmdCooldown = {};

var cooldown = {};

  module.exports = class {
      constructor(client) {
          this.client = client;
      }

      run(message) {

        const client = this.client;
  
    client.Database.ref(`Servidores/Invite/${message.guild.id}`).once("value").then(async function (db) {
      let invite = db.val() ? db.val().invite : "não";
      if (invite === "sim") {
        const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
        if (regex.exec(message.content)) {
          if (!message.member.hasPermission("ADMINISTRATOR")) {
            await message.delete();
            return message.channel
              .send(
                `**Você não tem permissão para mandar invites!**`
              )
              .then(msg => {
                setTimeout(() => {
                  msg.delete();
                }, 10000);
              });
          }
        }
      }
    });

    client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once("value").then(async function (db2) {
      const prefix = db2.val() ? db2.val().prefix : config.bot.prefix;

      if(message.author.bot || message.channel.type == "dm" || !message.content.startsWith(prefix)) {
        return;
      }
    
      const args = message.content.split(/\s+/g);
      const command = args.shift().slice(prefix.length);
      const commandFile = client.commands.get(command) || client.commands.get(client.aliases.get(command));

      if(!commandFile) {
        return;
      }
    
      if (commandFile.help.enabled == false) {
        return message.channel.send(`Desculpe porém este comando está desabilitado.`);
      }

      if(commandFile.help.owner === true && message.author.id !== "485088800540983299") {
        return message.channel.send(`Este comando é apenas para pessoas especiais.`);
      }

      let uCooldown = cmdCooldown[message.author.id];
      if (!uCooldown) {
        cmdCooldown[message.author.id] = {};
        uCooldown = cmdCooldown[message.author.id];
      }
      const time = uCooldown[commandFile] || 0;
      if (time && (time > Date.now())) {
        return message.channel.send("**Você está em cooldown. Espere e tente novamente mais tarde.**").then(msg => {
          setTimeout(() => {
            msg.delete()
          }, 3500)
        });
      }
      cmdCooldown[message.author.id][commandFile] = Date.now() + 5000;

      try {
        commandFile.setMessage(message);
        commandFile.run(message, args, Discord);

        if(commandFile.help.category === "Mod"){
				  message.delete();
			  }
      } catch (err) {
        console.log(err);
      }
    });
  };
}
