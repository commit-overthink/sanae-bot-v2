const Discord = require("discord.js");
const { prefix, minPollTime, maxPollTime } = require("../../config.json");

// TODO:
// Stop poll command
// Make notifications for longer polls be sent
// certain roles can mark polls important or urgent, allowing the poll to be longer than one hour, also ^^^sending notifications. also sends the result in #announcements
// run result messages to use a list of adverbs to make every message slightly different.

module.exports = {
  name: "poll-start",
  aliases: ["pollstart"],
  description:
    "Starts a poll. Setting the prompt can be done using the poll-set command",
  args: true,
  usage: "<seconds>",
  usePolls: true,
  cooldown: 0,
  execute(message, args, Polls) {
    // Gets required information for command to work
    const getInformation = async () => {
      try {
        const pollTime = args[0] * 1000;
        let embed = {};
        let options = [];
        let isRunningPoll = false;
        let cancelMessage = false;
        const poll = await Polls.findOne({
          where: { user: message.author.username },
        });
        console.log(poll);

        if (pollTime >= maxPollTime * 1000) {
          cancelMessage = true;
          message.channel.send(
            `Sorry ${message.author}, but the poll must be at most \`${maxPollTime}\` seconds long.`
          );
        }
        if (poll === null) {
          cancelMessage = true;
          message.channel.send(
            `Sorry ${message.author}, but you need to set the poll's prompt using \`${prefix}poll-setprompt\`. Type \`${prefix}help\` for more information.`
          );
        } else {
          embed = new Discord.MessageEmbed()
            .setColor("#59be84")
            .setTitle(`${message.author.username}'s poll:`)
            .setDescription(poll.prompt);
          options = poll.options;
          // options = poll.options.split(",");
          // when options is read from the database, it is a string, so it needs to be parsed.
          isRunningPoll = poll.isRunningPoll;
        }
        if (isRunningPoll) {
          cancelMessage = true;
          message.channel.send(
            `Sorry ${message.author}, but you're already running a poll!`
          );
        }
        return { embed, pollTime, options, cancelMessage };
      } catch (e) {
        console.error(e);
      }
    };

    const calculateVote = (results) => {
      // could add messages for near ties, unanimous votes, votes where one option superceeds another...
      let largest = 0;
      let tie = false;
      let noWinners = false;
      let votePlurality = "votes";
      let largestEmoji = {};

      for (let i = 0; i < results.length; i++) {
        if (results[i].option.count > largest) {
          largest = results[i].option.count;
          largestEmoji = results[i].option.emoji;
          tie = false;
          noWinners = false;
        } else if (results[i].option.count === 0 && largest === 0) {
          noWinners = true;
          tie = false;
        } else if (results[i].option.count === largest) {
          tie = true;
        }
      }

      if (largest === 1) {
        votePlurality = "vote";
      }
      const resultsMessages = {
        noWinners: [
          `lmao no one responded to your poll ${message.author}`,
          `Sorry ${message.author}, but nobody wanted to vote on your poll.`,
          `${message.author}, you should try to get more people to vote on your poll next time.`,
        ],
        tie: [
          `${message.author}, tie!`,
          `${message.author}, it's a tie!`,
          `${message.author}, the vote is a tie!`,
          `${message.author}, that was a very close tie!`,
        ],
        lowVotes: [
          `${message.author}, ${largestEmoji} just won with ${largest} ${votePlurality}!`,
          `${message.author}, ${largestEmoji} won with ${largest} ${votePlurality}!`,
          `${message.author}, the winning emoji is ${largestEmoji} with ${largest} ${votePlurality}!`,
        ],
        highVotes: [
          `Woah ${message.author}, ${largestEmoji} won amazingly with ${largest} ${votePlurality}!`,
          `${message.author}, ${largestEmoji} had an outstanding win with ${largest} ${votePlurality}!`,
          `Hey! In ${message.author}'s poll, ${largestEmoji} won with a suprising ${largest} ${votePlurality}!`,
        ],
      };

      if (tie) {
        const selectedMessage = Math.floor(
          Math.random() * resultsMessages.tie.length
        );
        message.channel.send(resultsMessages.tie[selectedMessage]);
      } else if (noWinners) {
        const selectedMessage = Math.floor(
          Math.random() * resultsMessages.noWinners.length
        );
        message.channel.send(resultsMessages.noWinners[selectedMessage]);
      } else {
        if (largest < 3) {
          const selectedMessage = Math.floor(
            Math.random() * resultsMessages.lowVotes.length
          );
          message.channel.send(resultsMessages.lowVotes[selectedMessage]);
        } else {
          const selectedMessage = Math.floor(
            Math.random() * resultsMessages.highVotes.length
          );
          message.channel.send(resultsMessages.highVotes[selectedMessage]);
        }
      }
    };

    const startPoll = async () => {
      try {
        const info = await getInformation(args, Polls).catch(console.error);
        const embed = info.embed;
        const pollTime = info.pollTime;
        let options = info.options;
        options = options.split(",");
        console.log(options);
        let cancelMessage = info.cancelMessage;
        // I don't think I can just use a destructuring assignment here because I need both const and let variables.

        if (pollTime < minPollTime * 1000) {
          cancelMessage = true;
          message.channel.send(
            `Sorry ${message.author}, but the poll must run for at least ${minPollTime} seconds.`
          );
        }
        if (pollTime !== pollTime) {
          cancelMessage = true;
          message.channel.send(
            `Sorry ${message.author}, but the correct usage is \`${prefix}${this.name} ${this.usage}\``
          );
        }
        if (cancelMessage === true) {
          // needed in order for a message not to be sent in case if the user sees an error.
          // Do nothing
        } else {
          message.channel
            .send({ embeds: [embed] })
            .then(async (sentMessage) => {
              // == pre poll ==
              const results = [];
              let running = false;

              const afterVote = () => {
                if (!running) {
                  running = true;
                  setTimeout(async () => {
                    Polls.update(
                      { isRunningPoll: false },
                      { where: { user: message.author.username } }
                    ).catch(console.error);
                    calculateVote(results);
                    // send object with all options with their final counts
                  }, pollTime);
                }
              };

              const getEmojis = (element) => {
                let emoji = message.guild.emojis.cache.find(
                  (object) => object.name === element
                );
                if (emoji != undefined) {
                  const filter = (reaction) =>
                    reaction.emoji.name === emoji.name;
                  return { emoji, filter };
                } else {
                  emoji = element;
                  const filter = (reaction) => reaction.emoji.name === element;
                  return { emoji, filter };
                }
              };

              await Polls.update(
                { isRunningPoll: true },
                { where: { user: message.author.username } }
              );
              // == start poll ==
              options.forEach(async (element) => {
                const { emoji, filter } = getEmojis(element);
                const collector = sentMessage.createReactionCollector({
                  filter,
                  time: pollTime,
                });
                let count = 0;

                await sentMessage.react(emoji);
                collector.on("collect", () => {
                  count++;
                  console.log(count);
                });
                collector.on("end", () => {
                  const object = {};
                  object.emoji = emoji;
                  object.count = count;
                  console.log(object);
                  results.push({ option: object });
                  console.log(results);
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
