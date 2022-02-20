const { Op } = require("sequelize");
const { currencyPrefix } = require("../../config.json");

module.exports = {
  name: "buy",
  description: "Buys an item.",
  args: true,
  usage: "<item name>",
  useCurrency: true,
  async execute(message, args, currency, Users, CurrencyShop) {
    args = args.join(" ");
    const item = await CurrencyShop.findOne({
      where: { name: { [Op.like]: args } },
    });
    if (!item)
      return message.channel.send(
        `Sorry ${message.author}, but that item isn't being sold in the shop!`
      );
    if (item.cost > currency.getBalance(message.author.id)) {
      return message.channel.send(
        `Sorry ${
          message.author
        }, but you only have ${currencyPrefix}${currency.getBalance(
          message.author.id
        )} while ${item.name} costs ${currencyPrefix}${item.cost}!`
      );
    }

    const user = await Users.findOne({ where: { user_id: message.author.id } });
    currency.add(message.author.id, -item.cost);
    await user.addItem(item);

    message.channel.send(`You've bought: \`${item.name}\``);
  },
};
