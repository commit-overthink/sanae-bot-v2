const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "balance",
    aliases: ["bal", "b"],
    description:
      "Shows the balance of you or another user.",
    usage: "<@user>",
    useCurrency: true,
    execute(message, args, currency) {
        const target = message.mentions.users.first() || message.author;
        if (target === message.author) {
            return message.channel.send(`${message.author}, you have ${currencyPrefix}${currency.getBalance(target.id)}`);
        } else {
            return message.channel.send(`${message.author}, ${target.tag} has ${currencyPrefix}${currency.getBalance(target.id)}`);
        }
    },
};