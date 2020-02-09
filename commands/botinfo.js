const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let bicon = bot.user.displayAvatarURL;
        let botversion = ("1.0");
        let botembed = new Discord.RichEmbed()
        .setDescription("Bot Informatie")
        .setColor("#15f153")
        .setThumbnail(bicon)
        .addField("Bot Naam", bot.user.username)
        .addField("Versie", botversion);

        return message.channel.send(botembed);
}

module.exports.help = {
    name: "botinfo"
}