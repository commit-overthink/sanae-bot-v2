const { prefix } = require("../config.json");

module.exports = {
  name: "poll-start",
  description:
    "Starts a poll. Setting the prompt can be done using the poll-set command",
  args: true,
  usage: "<seconds until end>",
  usePrompts: true,
  async execute(message, args, Prompts) {
    function calculateVote() {
      //prettier-ignore
      console.log(`countPostitive: ${countPositive}\ncountNegative: ${countNegative}`);
      if (countPositive > countNegative) {
        message.channel.send(
          `${positiveEmoji} won with ${countPositive} votes!`
        );
      } else if (countPositive < countNegative) {
        message.channel.send(
          `${negativeEmoji} won with ${countNegative} votes!`
        );
      } else {
        message.channel.send("Tie!");
      }
    }

    // fetch prompt
    const user = message.author.username;
    let prompt = await Prompts.findOne({ where: { user: user } });

    // prettier-ignore
    if  (prompt === null) {
      return message.channel.send(`Sorry ${message.author}, but you need to set the poll's prompt using \`${prefix}poll-prompt\``);
    }

    prompt = prompt.prompt;
    const item = prompt;
    const pollTime = args[0] * 1000;

    const positiveEmoji = message.guild.emojis.cache.find(
      (emoji) => emoji.name === "cirnu"
    );
    const negativeEmoji = message.guild.emojis.cache.find(
      (emoji) => emoji.name === "sadpup"
    );

    const filterPositive = (reaction, user) => {
      return reaction.emoji.name === positiveEmoji.name;
    };
    const filterNegative = (reaction) => {
      return reaction.emoji.name === negativeEmoji.name;
    };

    message.channel.send(item).then((sentItem) => {
      sentItem.react(positiveEmoji);
      sentItem.react(negativeEmoji);

      let countPositive = 0;
      let countNegative = 0;

      sentItem
        .awaitReactions(filterPositive, { time: pollTime, errors: ["time"] })
        .then((collected) => {
          countPositive = collected.size;
        })
        .catch(console.error);
      sentItem
        .awaitReactions(filterNegative, { time: pollTime, errors: ["time"] })
        .then((collected) => {
          countNegative = collected.size;
          calculateVote();
        })
        .catch(console.error);
    });
  },
};

// TODO: Check for errors on input
