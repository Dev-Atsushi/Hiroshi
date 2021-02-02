// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Invites extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "invites",
      category: "Mod",
      enabled: true,
      aliases: ["checkinvite", "invites", "checki"],
      owner: false
    });
  }
  async run(message, args, Discord) {

    message.client.Database.ref(`Servidores/Prefix/${message.guild.id}`).once('value').then(async function(db2) {
      const prefix = db2.val() ? db2.val().prefix : message.client.config.bot.prefix;
          
        let embede = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL())
        .addField("<:rikka_no:777511967362646037> | `"+prefix+"invites`", '**Utilize para checar os invites de um membro.**')
        .addField('<:rikka_yes:777512082669174814> | Como utilizar?', "`"+prefix+"invites` `<Membro>`")
        .addField('<:rikka_warn:777512813068419134> | Permissão do bot?', '**`Gerenciar Canal`**', true)
        .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true })) 
  
    
      if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(embede)
      }
    
    let member = await message.client.resolveMember(args[0], message.guild);
    if (!member) member = message.member;

    // Gets the invites
    const invites = await message.guild.fetchInvites().catch(() => {});
    
    const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);

    if(memberInvites.size <= 0){
        if(member === message.member){
            return message.channel.send("**<:rikka_warn:777512813068419134>・Você não convidou ninguém para o servidor!**");
        } else {
            return message.channel.send("**<:rikka_warn:777512813068419134>・"+member.user.username+" não convidou ninguém para o servidor!**")
        }
    }

    const content = memberInvites.map((i) => {
        const uses = i.uses,
        code = i.code,
        channel = i.channel.toString();
        return "**"+code+"** ("+uses+" usos)"
    }).join("\n");
    let index = 0;
    memberInvites.forEach((invite) => index += invite.uses);
        
    const total = index

		const embed = new Discord.MessageEmbed()
            .setDescription("<:lovekanji:776966204815704116> | Convites de "+member.user.username+" em "+message.guild.name+"")
            .addField("<:flower:776965727688589362>・Membros", ""+total+" membros")
            .addField("<:rikka_add:777896091840413778>・Invites", content)
            .setFooter("Comando requesitado por "+message.author.username+"",  message.author.displayAvatarURL({ dynamic: true }))
            .setColor("BLACK")
            .setAuthor(message.client.config.bot.botname, message.client.user.displayAvatarURL());
            
		message.channel.send(embed);
    })
  }
 }
 module.exports = Invites;