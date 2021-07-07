const { prefix, maxPollTime } = require("../../config.json");

// Stop poll command
// Make notifications for longer polls be sent
// certain roles can mark polls important or urgent, allowing the poll to be longer than one hour, also ^^^sending notifications. also sends the result in #announcements

module.exports = {
	name: "poll-start",
	description:
    "Starts a poll. Setting the prompt can be done using the poll-set command",
	args: true,
	usage: "<seconds>",
	usePolls: true,
	execute(message, args, Polls) {
		// Gets required information for command to work
		const getInformation = async () => {
			try {
				let pollTime = args[0] * 1000;
				let prompt = "";
				let isRunningPoll = false;
				let cancelMessage = false;
				const poll = await Polls.findOne({ where: { user: message.author.username } });
				const emojiPositive = message.guild.emojis.cache.find((emoji) => emoji.name === "cirnu");
				const emojiNegative = message.guild.emojis.cache.find((emoji) => emoji.name === "sadpup");
				// these emojis will be change to be more semantic
				if (pollTime !== pollTime) {
					// checks if pollTime is a number. If truesets pollTime to 0 which will later send the user an error.
					pollTime = 0;
				}
				if (pollTime >= maxPollTime * 1000) {
					cancelMessage = true;
					message.channel.send(`Sorry ${message.author}, but the poll must be at most \`${maxPollTime}\` seconds long.`);
				}
				if (poll === null) {
					cancelMessage = true;
					message.channel.send(`Sorry ${message.author}, but you need to set the poll's prompt using \`${prefix}poll-setprompt\`. Type \`${prefix}help\` for more information.`);
				}
				else {
					prompt = `${message.author}'s poll: \`${poll.prompt}\``;
					isRunningPoll = poll.isRunningPoll;
				}
				if (isRunningPoll) {
					cancelMessage = true;
					message.channel.send(`Sorry ${message.author}, but you're already running a poll!`);
				}
				return { prompt, pollTime, emojiPositive, emojiNegative, cancelMessage };
			} catch (e) {
				console.error(e);
			}
		};

		// prettier-ignore
		const calculateVote = (countPositive, countNegative, emojiPositive, emojiNegative) => {
			let votePlurality = "votes";
			if (countPositive > countNegative) {
				if (countPositive < 2) {
					votePlurality = "vote";
				}
				message.channel.send(
					`Woah ${message.author}, ${emojiPositive} won amazingly with ${countPositive} ${votePlurality}!`,
				);
			}
			else if (countPositive < countNegative) {
				if (countNegative < 2) {
					votePlurality = "vote";
				}
				message.channel.send(
					`Hey ${message.author}, ${emojiNegative} won easily with ${countNegative} ${votePlurality}!`,
				);
			}
			else {
				message.channel.send(`${message.author}, It's a tie!`);
			}
		};

		const startPoll = async () => {
			try {
				const { prompt, pollTime, emojiPositive, emojiNegative, cancelMessage } = await getInformation(args, Polls).catch(console.error);

				if (pollTime === 0) {
					message.channel.send(
						`Sorry ${message.author}, but the correct usage is \`${prefix}${this.name} ${this.usage}\``,
					);
				}
				else if (cancelMessage === true) {
					// needed in order for a message not to be sent in case if the user sees an error.
					// Do nothing
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

						// updates isRunningPoll so the user can't start another one until the current is overs
						await Polls.update(
							{ isRunningPoll: true },
							{ where: { user: message.author.username } },
						);

						positiveCollector.on("collect", async () => {
							countPositive++;
						});
						negativeCollector.on("collect", () => {
							countNegative++;
						});
						positiveCollector.on("end", async () => {
							await Polls.update(
								{ isRunningPoll: false },
								{ where: { user: message.author.username } },
							);
						});

						negativeCollector.on("end", () => calculateVote(countPositive, countNegative, emojiPositive, emojiNegative));
					});
				}
			} catch (e) {
				console.error(e);
			}
		};

		startPoll(args, Polls).catch(console.error);
	},
};
