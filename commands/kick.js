const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send("Kan gebruiker niet vinden.");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Leuk geprobeerd.");
        if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Deze gebruiker kan niet gekickt worden!");

        let kickEmbed = new Discord.RichEmbed()
        .setDescription("~Kick~")
        .setColor("#e56b00")
        .addField("Gekickte gebruiker", `${kUser} met het ID: ${kUser.id}`)
        .addField("Gekickt door", `<@${message.author.id}> met het ID ${message.author.id}`)
        .addField("Gekickt in", message.channel)
        .addField("Tijd", message.createdAt)
        .addField("Reden", kReason);

        let kickChannel = message.guild.channels.find(`name`, "incidenten");
        if(!kickChannel) return message.channel.send("Kan geen incidenten kanaal vinden");
        
        message.guild.member(kUser).kick(kReason);
        kickChannel.send(kickEmbed);

}

module.exports.help = {
    name: "kick"
}