const { prefix, maxPollTime } = require('../../config.json');

// Don't let someone run two polls concurrently
// Create a max usable time
// Stop poll command
// Make notifications for longer polls be sent
// certain roles can mark polls important or urgent, allowing the poll to be longer than one hour, also ^^^sending notifications. also sends the result in #announcements

module.exports = {
	name: 'poll-start',
	description:
    'Starts a poll. Setting the prompt can be done using the poll-set command',
	args: true,
	usage: '<seconds>',
	usePolls: true,
	execute(message, args, Polls) {
		// Gets required information for command to work
		const getInformation = async () => {
			let pollTime = args[0] * 1000;
			let prompt = await Polls.findOne({ where: { user: message.author.username } });
			const emojiPositive = message.guild.emojis.cache.find((emoji) => emoji.name === 'cirnu');
			const emojiNegative = message.guild.emojis.cache.find((emoji) => emoji.name === 'sadpup');
			// these emojis will be change to be more semantic

			if (pollTime !== pollTime) {
				// checks if pollTime is a number
				pollTime = 0;
			}
			if (pollTime >= maxPollTime * 1000) {
				// prettier-ignore
				return message.channel.send(`Sorry ${message.author}, but the poll must be at most \`${maxPollTime}\` seconds long.`);
			}
			if (prompt === null) {
				return message.channel.send(`Sorry ${message.author}, but you need to set the poll's prompt using \`${prefix}poll-setprompt\`. Type \`${prefix}help\` for more information.`);
			}
			else {
				prompt = `${message.author}'s poll: \`${prompt.prompt}\``;
			}

			return { prompt, pollTime, emojiPositive, emojiNegative };
		};

		// prettier-ignore
		const calculateVote = (countPositive, countNegative, emojiPositive, emojiNegative) => {
			let votePlurality = 'votes';
			if (countPositive > countNegative) {
				if (countPositive < 2) {
					votePlurality = 'vote';
				}
				message.channel.send(
					`Woah, ${emojiPositive} won amazingly with ${countPositive} ${votePlurality}!`,
				);
			}
			else if (countPositive < countNegative) {
				if (countNegative < 2) {
					votePlurality = 'vote';
				}
				message.channel.send(
					`Oh my, ${emojiNegative} won easily with ${countNegative} ${votePlurality}!`,
				);
			}
			else {
				message.channel.send('It\'s a tie!');
			}
		};

		const startPoll = async () => {
			const { prompt, pollTime, emojiPositive, emojiNegative } =
        await getInformation(args, Polls);

			if (pollTime === 0) {
				message.channel.send(
					`Sorry ${message.author}, but the correct usage is \`${prefix}${this.name} ${this.usage}\``,
				);
			}
			else {
				const filterPositive = (reaction) =>
					reaction.emoji.name === emojiPositive.name;
				const filterNegative = (reaction) =>
					reaction.emoji.name === emojiNegative.name;

				let countPositive = 0;
				let countNegative = 0;

				message.channel.send(prompt).then(async (sentMessage) => {
					await sentMessage.react(emojiPositive);
					await sentMessage.react(emojiNegative);
					const positiveCollector = sentMessage.createReactionCollector(
						filterPositive,
						{ time: pollTime },
					);
					const negativeCollector = sentMessage.createReactionCollector(
						filterNegative,
						{ time: pollTime },
					);

					positiveCollector.on('collect', () => {
						countPositive++;
					});
					negativeCollector.on('collect', () => {
						countNegative++;
					});
					positiveCollector.on('end', () => {});
					// prettier-ignore
					negativeCollector.on('end', () => calculateVote(countPositive, countNegative, emojiPositive, emojiNegative));
				});
			}
		};

		startPoll(args, Polls);
	},
};
