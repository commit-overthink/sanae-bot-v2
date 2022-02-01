module.exports = {
  name: "poll-setoptions",
  aliases: ["poll-options", "poll-setoption", "pollsetoptions", "polloptions", "pollsetoption", "polloption"],
  description:
    "Sets the options (what you react to) in a poll. Add as many as you like.",
  args: true,
  usage: "<emoji 1> <emoji ...>",
  usePolls: true,
  execute(message, args, Polls) {
    const checkIfPollExists = async () => {
      try {
        const poll = await Polls.findOne({
          where: { user: message.author.username },
        });

        if (poll != null) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error(e);
      }
    };

    const checkIfEmojiExists = (inputedEmoji) => {
      try {
        const discordRegex = /:(.*?):/;
        const unicodeRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
        // Most unicode ranges for emojis
        let emojiName = discordRegex.exec(inputedEmoji);
        let isUnicodeEmoji = false;
        if (emojiName != null) {
          emojiName = emojiName[1];
          const emoji = message.guild.emojis.cache.find((object) => object.name === emojiName);
          // We need to do some regex magic here to get the emoji's name out of it's <name:snowflake> form
          // If returned regex object is null (the emoji doesn't exist), undefined is returned to send the user an error.
          return { emoji, isUnicodeEmoji };
        } else if (unicodeRegex.test(inputedEmoji)) {
          const emoji = inputedEmoji;
          isUnicodeEmoji = true;
          return { emoji, isUnicodeEmoji };
        } else {
          return undefined;
          // Returns undefined in case if the inputted emoji doesn't exist, should send an error to the user later.
        }
      } catch (e) {
        console.error(e);
      }
    };

    const updateOptions = async (options, emojis) => {
      if (await checkIfPollExists()) {
        emojis = emojis.join(" ");
        const promises = [];

        options.forEach(() => {
          promises.push(Polls.update({ options: options }, { where: { user: message.author.username } }));
        });
        Promise.all(promises).then(() => {
          return message.channel.send(`${message.author}, your poll's options are set to ${emojis}`);
        }).catch(console.error);
      } else {
        emojis = emojis.join(" ");

        Polls.create({
          user: message.author.username,
          options: options,
        });
        const tempPoll = await Polls.findOne({
          where: { user: message.author.username },
        });

        console.log(tempPoll);
        return message.channel.send(`${message.author}, your poll's options are set to ${emojis}`);
      }
    };

    const storeOptions = async (options, emojis) => {
      try {
        const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);

        if(await findDuplicates(options).length > 0) {
          return message.channel.send(`Sorry ${message.author}, but you can't set two options to be the same thing.`);
        } else {
          return updateOptions(options, emojis);
        }
      } catch (e) {
        console.log(e);
        return message.reply("Oops, something went wrong with changing the prompt.");
      }
    };

    const getEmojis = async () => {
      const options = [];
      const emojis = [];
      let cancelSetPrompt = false;

      args.forEach((element) => {
        const { emoji, isUnicodeEmoji } = checkIfEmojiExists(element);
        if (isUnicodeEmoji) {
          // Unicode emojis are not objects, so we must handle them differently.
          options.push(emoji);
          emojis.push(emoji);
        } else {
          if (emoji != undefined) {
            options.push(emoji.name);
            emojis.push(emoji);
          } else {
            cancelSetPrompt = true;
            message.channel.send(`My apologies ${message.author}, but there doesn't seem to be an emoji called \`${element}\`.`);
          }
        }
      });
      if (!cancelSetPrompt) {
        storeOptions(options, emojis);
        // This will push the emoji's name instead of storing the entire emoji object for efficency.
        // However, this does mean that the object will have to be looked up again when poll-start is called by the user.
      } else {
        // Do nothing
      }
    };

    getEmojis();
  },
};
