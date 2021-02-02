// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Serverlist extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "serverlist",
      category: "Owner",
      enabled: true,
      aliases: ["serverlist"],
      owner: true
    });
  }
  run(message, args, Discord) {
   
    const client = message.client;
    
    const i0 = 0;
    const i1 = 10;
    const page = 1;
   
    const description = `Servidores: ${client.guilds.cache.size}\n\n`+
      client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
        .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount}`)
          .slice(0, 10)
            .join("\n");
   
    let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor()
      .setFooter(client.user.username)
      .setTitle(`Página: ${page}/${Math.ceil(client.guilds.cache.size/10)}`)
      .setDescription(description);
   
    message.channel.send(embed).then(async msg => {
      
      await msg.react("⬅");
      await msg.react("➡");
      await msg.react("❌");
   
      const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
      
      collector.on("collect", async(reaction) => {
   
        if(reaction._emoji.name === "⬅") {
   
          // Updates variables
          i0 = i0-10;
          i1 = i1-10;
          page = page-1;
                   
          // if there is no guild to display, delete the message
          if(i0 < 0) {
            return msg.delete();
          }
          
          if(!i0 || !i1) {
            return msg.delete();
          }
                   
          description = `Servidores: ${client.guilds.cache.size}\n\n`+
            client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
              .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membros`)
                .slice(i0, i1)
                  .join("\n");
   
          // Update the embed with new informations
            embed.setTitle(`Página: ${page}/${Math.round(client.guilds.cache.size/10)}`)
            .setDescription(description);
               
          // Edit the message 
          msg.edit(embed);
               
        }
   
        if(reaction._emoji.name === "➡") {
   
          // Updates variables
          i0 = i0+10;
          i1 = i1+10;
          page = page+1;
   
          // if there is no guild to display, delete the message
            if(i1 > client.guilds.cache.size + 10) {
              return msg.delete();
            }
            
            if(!i0 || !i1) {
              return msg.delete();
            }
   
            description = `Servidores: ${client.guilds.cache.size}\n\n`+
              client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membros`)
                  .slice(i0, i1)
                    .join("\n");
   
            // Update the embed with new informations
              embed.setTitle(`Página: ${page}/${Math.round(client.guilds.cache.size/10)}`)
              .setDescription(description);
               
            // Edit the message 
              msg.edit(embed);
   
        }
   
        if(reaction._emoji.name === "❌"){
          return msg.delete(); 
        }
   
        // Remove the reaction when the user react to the message
        await reaction.users.remove(message.author.id);
   
        });
      })
    }
  }

module.exports = Serverlist;