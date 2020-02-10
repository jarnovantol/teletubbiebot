const Discord = require("discord.js");
const prefix = "!";
let msg = message.content.toUpperCase();
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);
let commandfile = bot.commands.get(cmd.slice(prefix.length));
if(commandfile) commandfile.run(bot,message,args);


module.exports.run = async (bot, message, args) => {

    if (msg.startsWith(prefix + 'ban')) {    
        if (msg === `${prefix} ban`) {

            let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if(!bUser) return message.channel.send("Kan gebruiker niet vinden.");
            let bReason = args.join(" ").slice(22);
            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Leuk geprobeerd.");
            if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Deze gebruiker kan niet gebanned worden!");


            let banEmbed = new Discord.RichEmbed()
            .setDescription("~Ban~")
            .setColor("#bc0000")
            .addField("Gebande gebruiker", `${bUser} met het ID: ${bUser.id}`)
            .addField("Gebanned door", `<@${message.author.id}> met het ID ${message.author.id}`)
            .addField("Gebanned in", message.channel)
            .addField("Tijd", message.createdAt)
            .addField("Reden", bReason);

            let incidentchannel = message.guild.channels.find(`name`, "incidenten");
            if(!incidentchannel) return message.channel.send("Kan geen incidenten kanaal vinden");
            
            message.guild.member(bUser).ban(bReason);
            incidentchannel.send(banEmbed);
        }
    }
}

module.exports.help = {
    name: "ban",
    prefix: "!"
}