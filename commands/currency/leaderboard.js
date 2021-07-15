const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "leaderboard",
    description:
      "See who has more money than you!",
    useCurrency: true,
    async execute(message, args, currency) {
        return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                .filter(user => message.client.users.cache.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(message.client.users.cache.get(user.user_id).tag)}: ${currencyPrefix}${user.balance}`)
                .join("\n"),
            { code: true },
        );
    },
};