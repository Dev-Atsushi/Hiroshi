// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Notificar extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "notificar",
      category: "Owner", // For don't use other category
      enabled: true,
      aliases: ["notificar"],
      owner: false
    });
  }
  run(message, args, Discord) {

    const author = message.author.id;
    
    if(message.guild.id != "797149484765151292") {
      return;
    }

    const role = "798698369924333608";

    message.guild.members.cache.get(author).roles.add(role);
    return message.channel.send("**<a:estrelastar:769621593122537512> | Você agora será notificado sempre que houver um anúncio.**");
  }
}

module.exports = Notificar;