const { prefix, defaultCooldown } = require("../config.json");
const { Collection } = require("discord.js");

module.exports = {
	name: "messageCreate",
	execute(message, Polls, Users, CurrencyShop, currency) {
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		// Give message.author 1$ every time they use a command. currency.getBalance is called first to give user default funds.
		// currency.getBalance(message.author.id);

		if (currency.getBalance(message.author.id) === 0) {
			currency.add(message.author.id, 10);
			message.channel.send(`Did you really get broke while gambling?\nYour balance: ${currency.getBalance(message.author.id)}\n`);
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const { cooldowns } = message.client;

		const command =
		message.client.commands.get(commandName) ||
			message.client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
			);

		if (!command) return;

		if (command.guildOnly && message.channel.type === "dm") {
			return message.reply("Sorry! You can't use that command in the DMs!");
		}

		if (command.args && !args.length) {
			let reply = `Sorry, but you need to provide arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || defaultCooldown) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = Math.ceil((expirationTime - now) / 1000);
				let multipleSeconds = "seconds";

				if (timeLeft === 1) {
					multipleSeconds = "second";
				}

				return message.channel.send(
					`H-hang on ${message.author}! Please wait ${timeLeft} more ${multipleSeconds} before using \`${command.name}\` again.`,
				);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			// for poll commands
			if (command.usePolls === true) {
				command.execute(message, args, Polls);
			}
			// for currency commands
			else if (command.useCurrency === true) {
				command.execute(message, args, currency, Users, CurrencyShop);
			}
			else {
				command.execute(message, args);
			}
		}
		catch (error) {
			console.error(error);
			message.channel.send(
				`${message.author}! There's an error with executing this command!`,
			);
		}
	},
};
