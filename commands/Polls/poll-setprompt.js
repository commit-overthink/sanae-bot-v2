module.exports = {
	name: "poll-setprompt",
	aliases: ["poll-prompt", "pollsetprompt", "pollprompt"],
	description: "Sets the prompt for a poll. Use `SHIFT + ENTER` to make new lines.",
	args: true,
	usage: "<prompt>",
	usePolls: true,
	async execute(message, args, Polls) {
		let promptDescription = args.join(" ");
		promptDescription = promptDescription.toString();
		const user = message.author.username;

		const checkIfPollExists = async () => {
			const poll = await Polls.findOne({ where: { user: user } });
			if (poll != null) {
				return true;
			}
			else {
				return false;
			}
		};

		try {
			if (await checkIfPollExists()) {
				await Polls.update(
					{ prompt: promptDescription },
					{ where: { user: user } },
				);
				return message.channel.send(`*${message.author}, your poll's prompt is set to:* ${promptDescription}`);
			}
			else {
				await Polls.create({
					user: message.author.username,
					prompt: promptDescription,
				});
				return message.channel.send(`*${message.author}, your poll's prompt is set to:* ${promptDescription}`);
			}
		}
		catch (e) {
			console.log(e);
			return message.reply(
				"Oops, something went wrong with changing the prompt.",
			);
		}
	},
};