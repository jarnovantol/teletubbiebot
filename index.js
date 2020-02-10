const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
const commands = JSON.parse(fs.readFileSync('Storage/commands.json', 'utf8'));
const prefix = ""

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online op ${bot.guilds.size} servers!`);
  bot.user.setActivity("stoute mensen", {type: "WATCHING"});

});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  let msg = message.content.toUpperCase();
  if(commandfile) commandfile.run(bot,message,args);
  

});

bot.on('guildMemberAdd', member =>{

  const channel = member.guild.channels.find(channel => channel.name === "welkom");
  if(!channel) return;

  channel.send(`Welkom ${member} op de Teletubbie server!`);

  var role = member.guild.roles.find('name', '👶 Brugger');
  member.addRole(role)
});

bot.on('guildMemberRemove', member =>{

  const channel = member.guild.channels.find(channel => channel.name === "welkom");
  if(!channel) return;

  channel.send(`${member} is helaas de teletubbie wereld verlaten!`);

});

bot.on('message', message =>{

  const prefix = '!'; // This is the prefix, you can change it to whatever you want.
  let msg = message.content.toUpperCase(); // This variable takes the message, and turns it all into uppercase so it isn't case sensitive.
  let sender = message.author; // This variable takes the message, and finds who the author is.
  let cont = message.content.slice(prefix.length).split(" "); // This variable slices off the prefix, then puts the rest in an array based off the spaces
  let args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.

    // This episode will be going over the help command. We will also add a category system for the commands, for example: ~help mod (shows moderator commands), ~help admin (shows admin commands), as well as ~help <command> shows more info on the command
    if (msg.startsWith(prefix + 'HELP')) { // We're also going to use a seperate JSON file, so we need to call it.

        // Let's see if the only thing they typed in chat was ~help
        if (msg === `${prefix}HELP`) { // If they only type this, lets ONLY show the commands for regular users

            // Start of the embed
            const embed = new Discord.RichEmbed()
                .setColor(0x1D82B6) // You can set this color to whatever you want.

            // Variables
            let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.

            // Lets create the for loop that loops through the commands
            for (var cmd in commands) { // We should start creating the commands json first.

                // Checks if the group is "users" - and replace type with group
                if (commands[cmd].group.toUpperCase() === 'MEMBER') {
                    // Lets also count commandsFound + 1 every time it finds a command in the group
                    commandsFound++
                    // Lets add the command field to the embed
                    embed.addField(`${commands[cmd].name}`, `**Beschrijving:** ${commands[cmd].desc}\n**Toepassing:** ${prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
                }

            }

            // Add some more to the embed - we need to move that out of the for loop.
            embed.setFooter(`Toont op dit moment gebruikers commands. Om andere groepen te bekijken, doe ${prefix}help [Groep(staff of user) / Los command]`)
            embed.setDescription(`**${commandsFound} commands gevonden** - <> betekent verplicht, [] betekent optioneel`)

            // We can output it two ways. 1 - Send to DMs, and tell them that they sent to DMs in chat. 2 - Post commands in chat. [since commands take up a lot let's send to DMs]
            message.author.send({embed})
            // Post in chat they sent to DMs
            message.channel.send({embed: {
                color: 0x1D82B6,
                description: `**Bekijk je privéberichten ${message.author}!**`
            }})

            // Let's test this! - We have a few bugs first though.
            // Turns out you can only use the word embed to define embeds.

        } else if (args.join(" ").toUpperCase() === 'GROUPS') {

            // Variables
            let groups = '';

            for (var cmd in commands) {
                if (!groups.includes(commands[cmd].group)) {
                    groups += `${commands[cmd].group}\n`
                }
            }

            message.channel.send({embed: {
                description:`**${groups}**`,
                title:"Groups",
                color: 0x1D82B6
            }})

            return; // Testing!


        } else {
            // Now, lets do something when they do ~help [cmd / group] - You can use copy and paste for a lot of this part.

            // Variables
            let groupFound = '';

            for (var cmd in commands) { // This will see if their is a group named after what the user entered.

                if (args.join(" ").trim().toUpperCase() === commands[cmd].group.toUpperCase()) {
                    groupFound = commands[cmd].group.toUpperCase(); // Lets set the ground found, then break out of the loop.
                    break;
                }

            }

            if (groupFound != '') { // If a group is found, run this statement.

                // Start of the embed
                const embed = new Discord.RichEmbed()
                    .setColor(0x1D82B6) // You can set this color to whatever you want.

                // Variables
                let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.


                for (var cmd in commands) { // We can use copy and paste again

                    // Checks if the group is "users" - and replace type with group
                    if (commands[cmd].group.toUpperCase() === groupFound) {
                        // Lets also count commandsFound + 1 every time it finds a command in the group
                        commandsFound++
                        // Lets add the command field to the embed
                        embed.addField(`${commands[cmd].name}`, `**Beschrijving:** ${commands[cmd].desc}\n**Toepassing:** ${prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
                    }

                }

                // Add some more to the embed - we need to move that out of the for loop.
                embed.setFooter(`Op dit moment ${groupFound} commands aan het bekijken. Om een andere groep te bekijken, doe ${prefix}help [Groep(staff of user) / Los command]`)
                embed.setDescription(`**${commandsFound} commands gevonden** - <> betekent verplicht, [] betekent optioneel`)

                // We can output it two ways. 1 - Send to DMs, and tell them that they sent to DMs in chat. 2 - Post commands in chat. [since commands take up a lot let's send to DMs]
                message.author.send({embed})
                // Post in chat they sent to DMs
                message.channel.send({embed: {
                    color: 0x1D82B6,
                    description: `**Bekijk je privéberichten ${message.author}!**`
                }})

                // Make sure you copy and paste into the right place, lets test it now!
                return; // We want to make sure we return so it doesnt run the rest of the script after it finds a group! Lets test it!

                // Now lets show groups.
            }

            // Although, if a group is not found, lets see if it is a command

            // Variables
            let commandFound = '';
            let commandDesc = '';
            let commandUsage = '';
            let commandGroup = '';

            for (var cmd in commands) { // Copy and paste

                if (args.join(" ").trim().toUpperCase() === commands[cmd].name.toUpperCase()) {
                    commandFound = commands[cmd].name; // Lets change this so it doesnt make it go uppcase
                    commandDesc = commands[cmd].desc;
                    commandUsage = commands[cmd].usage;
                    commandGroup = commands[cmd].group;
                    break;
                }

            }

            // Lets post in chat if nothing is found!
            if (commandFound === '') {
                message.channel.send({embed: {
                    description:`**Geen groep gevonden genaamd \`${args.join(" ")}\`**`,
                    color: 0x1D82B6,
                }})

            }

            // Since this one is smaller, lets send the embed differently.
            message.channel.send({embed: {
                title:'<> betekent verplicht, [] betekent optioneel',
                color: 0x1D82B6,
                fields: [{
                    name:commandFound,
                    value:`**Beschrijving:** ${commandDesc}\n**Toepassing:** ${commandUsage}\n**Groep:** ${commandGroup}`
                }]
            }})

            return; // We want to return here so that it doesnt run the rest of the script also.

        }

    }

});

bot.login(process.env.token);