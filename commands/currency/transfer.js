const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "transfer",
    aliases: ["t"],
    description:
      "Transfer currency to another user.",
    args: true,
    usage: "<@user> <amount>",
    useCurrency: true,
    async execute(message, args, currency) {
        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = Number(args.find(a => !/<@!?\d+>/g.test(a)));
        const transferTarget = message.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount of money.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currencyPrefix}${currentAmount}`);
        if (transferAmount <= 0) return message.channel.send(`Please enter a greater amount than zero, ${message.author}!`);

        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${currencyPrefix}${transferAmount} to ${transferTarget.tag}. Your current balance is now ${currencyPrefix}${currency.getBalance(message.author.id)}`);
    },
};