module.exports = {
    name: "poll-options",
    description: "Sets the options for a poll. This should be made to add as many options as you want in the future.",
    args: true,
    usage: "<option 1 emoji> <option 2 emoji>",
    usePrompts: true,
    async execute(message, args, Prompts) {
        function findEmoji(emojiName) {
            const emoji = message.guild.emojis.cache.find(
                (emoji) => emoji.name === emojiName
              );
              return emoji;
        }
        
        async function checkIfEntryExists() {
            let prompt = await Prompts.findOne({ where: { user: message.author } });
            if (prompt != null) {
                return true;
              } else {
                return false;
              }
        }

        try {
            // DRY code. Should be refactored to be more semantic in the future.
            
            let option1 = findEmoji(args[0]);
            let option2 = findEmoji(args[1]);
            if (option1 && option2 != undefined) {
                // add to database, edit database if entry already exists
                if(await checkIfEntryExists()){
                    await Prompts.update({ option1: option1 }, { where: {user: user} });
                    await Prompts.update({ option2: option2 }, { where: {user: user} });
                    message.channel.send(`Set option 1 to ${option1}`);
                    message.channel.send(`Set option 2 to ${option2}`);
                  } else {
                    const prompt = await Prompts.create({
                        user: message.author.username,
                        option1: option1,
                        option2: option2,
                    });
                    return message.reply(`Prompt is set to \`${prompt.prompt}\``);
                  }    
                
            } else {
                reply = `Sorry ${message.author}, but`
                errorCount = 0;
                if (option1 === undefined) {
                    reply += ` \`<option 1 emoji>\``;
                    errorCount++;
                }
                if (option2 === undefined) {
                    reply += ` \`<option 2 emoji>\``;
                    errorCount++;
                }
                if (errorCount < 2) {
                    reply += ` is not an emoji.`;
                } else {
                    reply += ` are not emojis.`;
                }
                message.channel.send(reply);
            }
        } catch (e) {
            console.error(e);
            message.reply("Oops, something went wrong!");
        }
    }
}