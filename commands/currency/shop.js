const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "shop",
    description:
      "Shows items being sold in the shop.",
    useCurrency: true,
    async execute(message, args, currency, Users, CurrencyShop) {
        const items = await CurrencyShop.findAll();
        return message.channel.send(items.map(item => `${item.name}: ${currencyPrefix}${item.cost}`).join("\n"), { code: true });
    },
};