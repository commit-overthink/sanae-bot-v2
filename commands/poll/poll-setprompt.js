module.exports = {
	name: 'poll-setprompt',
	description: 'Sets the prompt for a poll. Use `\\n` to make new lines.',
	args: true,
	usage: '<prompt>',
	usePolls: true,
	async execute(message, args, Polls) {
		let promptDescription = args.join(' ');
		promptDescription = promptDescription.toString();
		// Weird capitalization, but I needed to pass the capitalized version through to this file somehow.
		user = message.author.username;

		async function checkIfPollExists() {
			const poll = await Polls.findOne({ where: { user: user } });
			if (poll != null) {
				return true;
			}
			else {
				return false;
			}
		}

		try {
			if (await checkIfPollExists()) {
				await Polls.update(
					{ prompt: promptDescription },
					{ where: { user: user } },
				);
				return message.reply(`Prompt is set to \`${promptDescription}\``);
			}
			else {
				const poll = await Polls.create({
					user: message.author.username,
					prompt: promptDescription,
				});
				return message.reply(`Prompt is set to \`${poll.prompt}\``);
			}
		}
		catch (e) {
			if (e === 'SequelizeUniqueConstraintError') {
				return message.reply('Sorry, but that\'s the current prompt.');
			}
			console.log(e);
			return message.reply(
				'Oops, something went wrong with changing the prompt.',
			);
		}
	},
};
