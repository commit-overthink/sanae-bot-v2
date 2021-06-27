const { prefix, token, defaultCooldown } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "message",
  execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const { cooldowns } = message.client;

    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (command.guildOnly && message.channel.type === "dm") {
      return message.reply("Sorry! You can't use that command in the DMs!");
    }

    if (command.args && !args.length) {
      let reply = `Sorry! You need to provide arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
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
      console.log(expirationTime);
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        let multipleSeconds = "seconds";

        if (timeLeft < 1) {
          multipleSeconds = "second";
        }

        return message.channel.send(
          `H-hang on ${message.author}! Please wait ${timeLeft.toFixed(
            1
          )} more ${multipleSeconds} before using \`${command.name}\` again.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.channel.send(
        `${message.author}! There's an error with executing this command!`
      );
    }
  },
};
