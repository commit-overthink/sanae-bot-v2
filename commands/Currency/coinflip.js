const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "coinflip",
    aliases: ["flip", "f"],
    cooldown: 1,
    description:
      "Flip a coin. Bet an amount of money that either doubles or is lost.",
    args: true,
    usage: "<amount>, <heads or tails>",
    useCurrency: true,
    async execute(message, args, currency) {
        // generate true or false randomly
        const bet = args[0];
	const guess = args[1];
	var heads = true; //if the coin was heads
	var correct = false; // Was the guess correct
    const max = 2
    const number = Math.floor(Math.random() * max);

        if (bet > currency.getBalance(message.author.id)) {
            return message.channel.send(`Sorry ${message.author}, but you can't make that bet since you only have ${currencyPrefix}${currency.getBalance(message.author.id)}.`);
        }
        if (guess === undefined)
            return message.channel.send(`Please specify if you want heads or tails ${message.author}. Arguments are <amount> <heads or tails> `)
	//decide if heads or tails
	if (number === 1) {
		heads = true;
	} else {
		heads = false

	//check if correct
	if (heads === true && guess === 'heads') {
		correct = true;
	} else if (heads === false && guess === 'tails') {
		correct = true;
    } else {
          correct = false;
      }
	}
        if (correct === true && heads === true) {
            currency.add(message.author.id, bet * 2);
            return message.channel.send(`It was heads!\nYour balance: ${currencyPrefix}${currency.getBalance(message.author.id)}`);
        } else if (correct === false && heads === true){
            currency.add(message.author.id, bet * -1);
            return message.channel.send(`It was heads...\nYour balance: ${currencyPrefix}${currency.getBalance(message.author.id)}`);
        } else if (correct === true && heads === false){
	    currency.add(message.author.id, bet * 2);
	    return message.channel.send(`It was tails!\nYour balance: ${currencyPrefix}${currency.getBalance(message.author.id)}`);
	} else {
	    currency.add(message.author.id, bet * -1);
	    return message.channel.send(`It was tails...\nYour balance: ${currencyPrefix}${currency.getBalance(message.author.id)}`);
        }

        // incorrect: double amount, give to User
        // correct: subtract amount from User
    }
}
