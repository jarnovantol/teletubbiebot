const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("Kan gebruiker niet vinden.");
        let reason = args.join(" ").slice(22);

        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Reports")
        .setColor("#15f153")
        .addField("Reported Gebruiker", `${rUser} met het ID: ${rUser.id}`)
        .addField("Gereport door", `${message.author} met het ID: ${message.author.id}`)
        .addField("Kanaal", message.channel)
        .addField("Tijd", message.createdAt)
        .addField("Reden", reason);


        let reportschannel = message.guild.channels.find(`name`, "incidenten");
        if(!reportschannel) return message.channel.send("Kan geen incidenten kanaal vinden");

        message.delete().catch(O_o=>{});
        reportschannel.send(reportEmbed);

}

module.exports.help = {
    name: "report",
    prefix: "!"
}