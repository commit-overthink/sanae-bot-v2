const { prefix, defaultEmbedColor } = require("../../config.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description:
    "A list of all of the commands you can use, or info about a certain command.",
  aliases: ["commands", "commands", "commandslist", "commandlist", "h"],
  usage: "<command name>",
  execute(message, args) {
    let embed = new Discord.MessageEmbed().setColor(defaultEmbedColor);
    const { commands } = message.client;

    if (!args.length) {
      const commandFolders = fs.readdirSync("./commands");
      let commandFiles;

      for (const folder of commandFolders) {
        const commandNames = [];
        commandFiles = fs
          .readdirSync(`./commands/${folder}`)
          .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
          const fileName = file.replace(".js", "");
          const found = commands.find((command) => command.name === fileName);
          commandNames.push(found.name);
        }
        const fieldTitle = `${folder}`;
        const fieldInfo = `${commandNames.join(", ")}`;
        embed = embed
          .addField(fieldTitle, fieldInfo)
          .setTitle(`*"Help!"*`)
          .setDescription(
            `Use \`${prefix}help <command name>\` to get more info about a specific command.`
          );
      }

      // data.push(commands.map(command => command.name).join(", "));
      message.channel.send({ embeds: [embed] });
    } else {
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find((c) => c.aliases && c.aliases.includes(name));

      if (!command) {
        return message.reply("Sorry, that's not a command!");
      }

      embed = embed.setTitle(`Help: *${command.name}*`);
      if (command.aliases)
        embed = embed.addField(`Aliases`, `${command.aliases.join(", ")}`);
      if (command.description)
        embed = embed.addField(`Description`, `${command.description}`);
      if (command.usage)
        embed = embed.addField(
          `Usage`,
          `\`${prefix}${command.name} ${command.usage}\``
        );
      embed = embed.addField(`Cooldown`, `${command.cooldown || 3} seconds`);

      message.channel.send({ embeds: [embed] });
    }
  },
};
