const { prefix, minPollTime, maxPollTime } = require("../../config.json");

// Stop poll command
// Make notifications for longer polls be sent
// certain roles can mark polls important or urgent, allowing the poll to be longer than one hour, also ^^^sending notifications. also sends the result in #announcements
// run result messages to use a list of adverbs to make every message slightly different.

module.exports = {
	name: "poll-start",
	description:
    "Starts a poll. Setting the prompt can be done using the poll-set command",
	args: true,
	usage: "<seconds>",
	usePolls: true,
	cooldown: 0,
	execute(message, args, Polls) {
		const getInformation = async () => {
			try {
				const pollTime = args[0] * 1000;
				let prompt = "";
				let options = [];
				let isRunningPoll = false;
				let cancelMessage = false;
				const poll = await Polls.findOne({ where: { user: message.author.username } });

				// these emojis will be change to be more semantic
				if (pollTime >= maxPollTime * 1000) {
					cancelMessage = true;
					message.channel.send(`Sorry ${message.author}, but the poll must be at most \`${maxPollTime}\` seconds long.`);
				}
				if (poll === null) {
					cancelMessage = true;
					message.channel.send(`Sorry ${message.author}, but you need to set the poll's prompt using \`${prefix}poll-setprompt\`. Type \`${prefix}help\` for more information.`);
				}
				else {
					prompt = `*${message.author}'s poll:* ${poll.prompt}`;
					options = poll.options.split(",");
					// when options is read from the database, it is a string, so it needs to be parsed.
					isRunningPoll = poll.isRunningPoll;
					console.log(isRunningPoll);
				}
				if (isRunningPoll) {
					cancelMessage = true;
					message.channel.send(`Sorry ${message.author}, but you're already running a poll!`);
				}
				return { prompt, pollTime, options, cancelMessage };
			} catch (e) {
				console.error(e);
			}
		};
		// Gets required information for command to work

		const calculateVote = (results) => {
			console.log(results);
			let largest = 0;
			let tie = false;
			let noWinners = false;
			let votePlurality = "votes";
			let largestEmoji = {};

			for (let i = 0; i < results.length; i++) {
				if(results[i].option.count > largest) {
					largest = results[i].option.count;
					largestEmoji = results[i].option.emoji;
					tie = false;
					noWinners = false;
				}
				else if (results[i].option.count === 0 && largest === 0) {
					noWinners = true;
					tie = false;
				}
				else if (results[i].option.count === largest) {
					tie = true;
					console.log(results[i].option.count, largest);
				}
			}

			if(tie) {
				message.channel.send(`${message.author}, It's a tie!`);
			}
			else if(noWinners) {
				message.channel.send(`lmao no one responded to your poll ${message.author}`);
			}
			else {
				if (largest === 1) {votePlurality = "vote";}
				message.channel.send(`Woah ${message.author}, ${largestEmoji} won amazingly with ${largest} ${votePlurality}!`);
			}

			console.log(`${largestEmoji.name} count: ${largest}`);
		};

		const startPoll = async () => {
			try {
				const info = await getInformation(args, Polls).catch(console.error);
				const prompt = info.prompt;
				const pollTime = info.pollTime;
				const options = info.options;
				let cancelMessage = info.cancelMessage;
				// I don't think I can just use a destructuring assignment here because I need both const and let variables.

				if (pollTime < minPollTime * 1000) {
					cancelMessage = true;
					message.channel.send(
						`Sorry ${message.author}, but the poll must run for at least ${minPollTime} seconds.`,
					);
				}
				if (pollTime !== pollTime) {
					cancelMessage = true;
					message.channel.send(
						`Sorry ${message.author}, but the correct usage is \`${prefix}${this.name} ${this.usage}\``,
					);
				}
				if (cancelMessage === true) {
					// needed in order for a message not to be sent in case if the user sees an error.
					// Do nothing
				}
				else {
					message.channel.send(prompt).then(async (sentMessage) => {
						// == pre poll ==
						const results = [];
						let running = false;

						const afterVote = () => {
							if (!running) {
								running = true;
								setTimeout(async (
								) => {
									Polls.update({ isRunningPoll: false }, { where: { user: message.author.username } })
									.catch(console.error);
									calculateVote(results);
									// send object with all options with their final counts
								}, pollTime);
							}
						};

						await Polls.update({ isRunningPoll: true }, { where: { user: message.author.username } });
						// == start poll ==
						options.forEach(async element => {
							const emoji = message.guild.emojis.cache.find((object) => object.name === element);
							const filter = (reaction) => reaction.emoji.name === emoji.name;
							const collector = sentMessage.createReactionCollector(filter, { time: pollTime });
							let count = 0;

							await sentMessage.react(emoji);
							collector.on("collect", async () => {
								count++;
							});
							collector.on("end", async () => {
								console.log(`${emoji.name} collector ended`);
								console.log(`${emoji.name} count: ${count}`);
								const object = {};
								object.emoji = emoji;
								object.count = count;
								results.push({ option: object });
							});
							// == post poll ==
							afterVote();
						});
					});
				}
			} catch (e) {
				console.error(e);
			}
		};

		startPoll(args, Polls);
	},
};
