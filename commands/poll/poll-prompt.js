module.exports = {
  name: "poll-prompt",
  description: "Sets the prompt for a poll. Use `\\n` to make new lines.",
  args: true,
  usage: "<prompt>",
  usePrompts: true,
  async execute(message, args, prompts) {
    let promptDescription = args.join(' ');
    promptDescription = promptDescription.toString(); 
    // Weird capitalization, but I needed to pass the capitalized version through to this file somehow.
    Prompts = prompts;
    user = message.author.username;

    async function checkIfPromptExists() {
        let prompt = await Prompts.findOne({ where: { user: user } });
        if (prompt != null) {
          return true;
        } else {
          return false;
        }
    }

    try{
        if(await checkIfPromptExists()){
          await Prompts.update({ prompt: promptDescription }, { where: {user: user} });
          return message.reply(`Prompt is set to \`${promptDescription}\``);
        } else {
          const prompt = await Prompts.create({
              user: message.author.username,
              prompt: promptDescription
          });
          return message.reply(`Prompt is set to \`${prompt.prompt}\``);
        }
    } catch (e) {
        if (e === "SequelizeUniqueConstraintError") {
            return message.reply("Sorry, but that's the current prompt.");
        }
        console.log(e);
        return message.reply("Oops, something went wrong with changing the prompt.");
    }

  },
};
