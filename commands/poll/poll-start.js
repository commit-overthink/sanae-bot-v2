const { prefix } = require("../../config.json"); 

// Append the prompt to "@users#1234 poll:"
// Don't let someone run two polls concurrently
// Create a max usable time
// Stop poll command

module.exports = {
    name: "poll-start",
    description:
      "Starts a poll. Setting the prompt can be done using the poll-set command",
    args: true,
    usage: "<seconds>",
    usePolls: true,
    execute(message, args, Polls) {
        // Gets required information for command to work
        const getInformation = async (args, Polls) => {
            let pollTime = args[0] * 1000;
            let prompt = await Polls.findOne({ where: { user: message.author.username }});
            let emojiPositive = message.guild.emojis.cache.find(
                (emoji) => emoji.name === "cirnu"
            );
            let emojiNegative = message.guild.emojis.cache.find(
                (emoji) => emoji.name === "sadpup"
            );

            if (pollTime !== pollTime) {
                // checks if pollTime is a number
                pollTime = 0;
            }
            if  (prompt === null) {
                return message.channel.send(`Sorry ${message.author}, but you need to set the poll's prompt using \`${prefix}poll-setprompt\`. Type \`${prefix}help\` for more information.`);
            } else {
                prompt = prompt.prompt;
            }
            
            return {prompt, pollTime, emojiPositive, emojiNegative};
        }

        const calculateVote = (countPositive, countNegative, emojiPositive, emojiNegative) => {
            //prettier-ignore
            console.log(`countPostitive: ${countPositive}\ncountNegative: ${countNegative}`);
            if (countPositive > countNegative) {
              message.channel.send(
                `${emojiPositive} won with ${countPositive} votes!`
              );
            } else if (countPositive < countNegative) {
              message.channel.send(
                `${emojiNegative} won with ${countNegative} votes!`
              );
            } else {
              message.channel.send("Tie!");
            }
        }

        const startPoll = async (args, Polls) => {
            const {prompt, pollTime, emojiPositive, emojiNegative} = await getInformation(args, Polls);
            
            if (pollTime === 0) {
                message.channel.send(`Sorry ${message.author}, but the correct usage is \`${prefix}${this.name} ${this.usage}\``);
            } else {
                const filterPositive = (reaction) => (reaction.emoji.name === emojiPositive.name);
                const filterNegative = (reaction) => (reaction.emoji.name === emojiNegative.name);

                let countPositive = 0;
                let countNegative = 0;

                message.channel.send(prompt)
                .then(async (sentMessage) => {
                    await sentMessage.react(emojiPositive);
                    await sentMessage.react(emojiNegative);
                    const positiveCollector = sentMessage.createReactionCollector(filterPositive, { time: pollTime });
                    const negativeCollector = sentMessage.createReactionCollector(filterNegative, { time: pollTime });

                    positiveCollector.on("collect", () => {
                        countPositive++;
                    });
                    negativeCollector.on("collect", () => {
                        countNegative++;
                    });
                    positiveCollector.on("end", () => {});
                    negativeCollector.on("end", () => calculateVote(countPositive, countNegative, emojiPositive, emojiNegative));

                })
                ;
            }
        }

        startPoll(args, Polls);
    }
}