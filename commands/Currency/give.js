const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "give",
    aliases: ["g"],
    description:
      "Give an item to another user.",
    args: true,
    usage: "<@user> <item>",
    useCurrency: true,
    async execute(message, args, currency) {
      const giveTarget = message.mentions.users.first();
      if (giveTarget === undefined) {
        return message.channel.send(`Sorry ${message.author}, but you must tell me who to give the item to!`);
      } else {
        const giveItem = args.filter(a => a !== `<@!${giveTarget.id}>`);
        console.log(giveTarget, giveItem);
      }
;    },
};