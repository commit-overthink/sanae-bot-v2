const { prefix, token, defaultCooldown } = require("./config.json");
const Discord = require("discord.js"),
      fs      = require("fs")
      ;
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync("./commands")

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        // set new item in commands collection. key: command name, value: exported module
        client.commands.set(command.name, command);
    }
}

client.once('ready', async () => {
    console.log('Morning...');

    try {
        let link = await client.generateInvite({
            permissions: ["ADMINISTRATOR"]
        });
        console.log(`Here's the invite Phoenix! ${link}`);
    } catch(e) {
        console.log(e.stack);
    }
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const { cooldowns } = client;

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === "dm") {
        return message.reply("Sorry! You can't use that command in the DMs!");
    }

    if (command.args && !args.length) {
        let reply = `Sorry! You need to provide arguments, ${message.author}!`

        if(command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply);
    }


    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || defaultCooldown) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            let multipleSeconds = "seconds";

            if (timeLeft < 1) {
                multipleSeconds = "second";
            }
            
            return message.channel.send(`H-hang on ${message.author}! Please wait ${timeLeft.toFixed(1)} more ${multipleSeconds} before using \`${command.name}\` again.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(`${message.author}! There's an error with executing this command!`);
    }
})

client.login(token);