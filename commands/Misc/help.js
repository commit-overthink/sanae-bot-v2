const { prefix } = require("../../config.json");
const fs = require("fs");

module.exports = {
	name: "help",
	description: "A list of all of the commands you can use, or info about a certain command.",
	aliases: ["commands", "h"],
	usage: "<command name>",
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if(!args.length) {
			const commandFolders = fs.readdirSync("./commands");
			let commandFiles;

			data.push(`Use \`${prefix}help <command name>\` to get more info about a specific command.`);
			for (const folder of commandFolders) {
				const commandNames = [];
				commandFiles = fs
				.readdirSync(`./commands/${folder}`)
				.filter((file) => file.endsWith(".js"));

				for(const file of commandFiles) {
					const fileName = file.replace(".js", "");
					const found = commands.find(command => command.name === fileName);
					commandNames.push(found.name);
				}
				data.push(`__**${folder}**__\n${commandNames.join("  ")}`);
			}

			// data.push(commands.map(command => command.name).join(", "));

			return message.channel.send(data, { split: true });
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command) {
			return message.reply("Sorry, that's not a command!");
		}

		data.push(`**Name:** ${command.name}`);
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
		data.push(`**Cooldown:** ${command.cooldown || 3} seconds`);

		message.channel.send(data, { split: true });
	},
};