const { prefix } = require("../../config.json");

function isInt(value) {
	if(isNaN(value)) return false;
	return true;
}

module.exports = {
	name: "roll",
	description: "The roll command from osu! Picks a random number.",
	aliases: ["rng", "random", "dice"],
	usage: "<MinValue> <MaxValue>",
	execute(message, args) {
		let min = 0;
		let max = 100;
		const errorMessage = `${message.author}, the correct usage is \`${prefix}${this.name} ${this.usage}\``;

		if (args[0] && !args[1]) return message.channel.send(errorMessage);
		if (args[1] && !isInt(args[1])) return message.channel.send(errorMessage);

		if (args[0]) min = Math.ceil(args[0]);
		if (args[1]) max = Math.floor(args[1]);

		let number = Math.floor(Math.random() * (max - min + 1) + min);
		if (number === 69) number = "69 :flushed:";

		message.channel.send(`${number}`);
	},
};
