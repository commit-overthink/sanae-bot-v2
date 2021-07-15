const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "coinflip",
    aliases: ["flip", "f"],
    cooldown: 1,
    description:
      "Flip a coin. Bet an amount of money that either doubles or is lost.",
    args: true,
    usage: "<amount>",
    useCurrency: true,
    async execute(message, args, currency) {
        // generate true or false randomly
        const bet = args[0];
        const max = 1;
		const number = Math.floor(Math.random() * (max + 1));

        if (bet > currency.getBalance(message.author.id)) {
            return message.channel.send(`Sorry ${message.author}, but you can't make that bet since you only have ${currencyPrefix}${currency.getBalance(message.author.id)}.`);
        }

        if (number === 1) {
            currency.add(message.author.id, bet * 2);
            return message.channel.send(`Heads!\nYour balance: ${currencyPrefix}${currency.getBalance(message.author.id)}`);
        } else {
            currency.add(message.author.id, -bet);
            return message.channel.send(`Tails...\nYour balance: ${currencyPrefix}${currency.getBalance(message.author.id)}`);
        }
        // true: double amount, give to User
        // false: subtract amount from User
    },
};