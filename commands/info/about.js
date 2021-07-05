const Discord = require("discord.js");

module.exports = {
  name: "about",
  description: "About Sanae.",
  execute(message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor("#59be84")
      .setTitle("About Sanae")
      .setURL("https://github.com/origami-matrix/sanae-bot-v2")
      .setDescription(
        "Bot made by @phoen1x239#9739,\nplease DM me for command ideas.\nType s!help to see a list of commands."
      );
    message.channel.send(embed);
  },
};
