module.exports = {
    name: "poll-start",
    description: "Starts a poll. Setting the prompt can be done using the poll-set command",
    args: true,
    usage: "<seconds until end>",
    execute(message, args) {
        // const item = quiz[0];
        // const filter = response => {
        //     return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        // };

        // message.channel.send(item.question).then(() => {
        //     message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
        //         .then(collected => {
        //             message.channel.send(`${message.author} is right!`);
        //         })
        //         .catch(collected => {
        //             message.channel.send("Looks like nobody got the answer... ya'll should play MoF.");
        //         });
        // });
        const item = "test"
        const pollTime = args[0] * 1000;
        const positiveEmoji = message.guild.emojis.cache.find(emoji => emoji.name === "cirnu");
        const negativeEmoji = message.guild.emojis.cache.find(emoji => emoji.name === "sadpup");

        const filterPositive = (reaction, user) => {
            return reaction.emoji.name === positiveEmoji.name && user.id === message.author.id;
        };
        const filterNegative = (reaction, user) => {
            return reaction.emoji.name === negativeEmoji.name && user.id === message.author.id;
        };


        message.channel.send(item).then(sentItem => {
            sentItem.react(positiveEmoji);
            sentItem.react(negativeEmoji);

            let countPositive = 0;
            let countNegative = 0;
            
            sentItem.awaitReactions(filterPositive, { time: pollTime, errors: ["time"] })
            .then(collected => console.log(collected.size))
            .catch(collected => {
                countPositive = collected.size;
            });
            sentItem.awaitReactions(filterNegative, { time: pollTime, errors: ["time"] })
            .then(collected => console.log(collected.size))
            .catch(collected => {
                countNegative = collected.size;
            })
            .then(() => {
                if (countPositive > countNegative) {
                    message.channel.send(`${positiveEmoji} won!`);
                } else if (countPositive < countNegative) {
                    message.channel.send(`${negativeEmoji} won!`);
                } else {
                    message.channel.send("Tie!");
                }
            })
        });
    },
};

// TODO: Check for errors on input