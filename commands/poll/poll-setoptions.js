module.exports = {
  name: "poll-setoptions",
  description:
    "Sets the options (what you react to) in a poll. Add as many as you like.",
  args: true,
  usage: "<emoji 1> <emoji ...>",
  usePolls: true,
  execute(message, args, Polls) {
    // check if options are already added, clear if so (this could be made more efficient by just replacing them)
    // for each arg, push into array
    // push array to database

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
        const regex = /:(.*?):/;
        let emojiName = regex.exec(inputedEmoji);
        if (emojiName != null) {
          emojiName = emojiName[1];
          return message.guild.emojis.cache.find((object) => object.name === emojiName);
        } else {
          return undefined;
        }
        // we need to do some regex magic here to get the emoji's name out of it's <name:snowflake> form
        // if returned regex object is null (the emoji doesn't exist), undefined is returned to send the user an error.
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
        await Polls.findOne({
          where: { user: message.author.username },
        });

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
        const emoji = checkIfEmojiExists(element);
        if (emoji != undefined) {
          options.push(emoji.name);
          emojis.push(emoji);
        } else {
          cancelSetPrompt = true;
          message.channel.send(`My apologies ${message.author}, but there doesn't seem to be an emoji called \`${element}\`.`);
        }
      });
      if (!cancelSetPrompt) {
        storeOptions(options, emojis);
        // this will push the emoji's name instead of storing the entire emoji object for efficency
        // however, this does mean that the object will have to be looked up again when poll-start is called by the user.
      } else {
        // Do nothing
      }
    };

    getEmojis();
  },
};
