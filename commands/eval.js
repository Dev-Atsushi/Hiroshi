// Import base command
const Base = require("../base/Command");

// Create a class for the command that extends the base command
 class Eval extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "eval",
      category: "Owner",
      enabled: true,
      aliases: ["eval"],
      owner: true
    });
  }
  async run(message, args, Discord) {
  
    await message.delete()
    
		const content = message.content.split(" ").slice(1).join(" ");
		const result = new Promise((resolve) => resolve(eval(content)));
  
    return result.then((output) => {
			if(typeof output !== "string"){
				output = require("util").inspect(output, { depth: 0 });
			}
			if(output.includes(message.client.token)){
				output = output.replace(message.client.token, "T0K3N");
			}    
                
      let saida = new Discord.MessageEmbed()    
       .setTitle(`Saida`)
       .setDescription(`\`\`\`${output}\`\`\``)
      
      message.channel.send(saida)
                
    }).catch((err) => {
             
      err = err.toString();
			if(err.includes(message.client.token)){
				err = err.replace(message.client.token, "T0K3N");
      }
      console.log(err)
        
      let errorrr = new Discord.MessageEmbed()           
       .setTitle(`Erro Detectado`)
       .setDescription(`\`\`\`${err}\`\`\``)
              
      message.channel.send(errorrr)
    })        
  }
}

module.exports = Eval;
