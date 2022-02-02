const Discord = require("discord.js");
const { prefix, defaultEmbedColor } = require("../../config.json");

module.exports = {
	name: "about",
	description: "About Sanae.",
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setColor(defaultEmbedColor)
			.setTitle("About Sanae")
			.setURL("https://github.com/origami-matrix/sanae-bot-v2")
			.setDescription(
				`Bot made by phoen1x239#9739.\nPlease DM me for command ideas.\nType ${prefix}help to see a list of commands.`,
			);
        message.channel.send({ embeds: [embed] });
	},
};
