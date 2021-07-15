const Discord = require("discord.js");
const { currencyPrefix } = require("../../config.json");

module.exports = {
    name: "shop",
    description:
      "Shows items being sold in the shop.",
    useCurrency: true,
    async execute(message, args, currency, Users, CurrencyShop) {
        const items = await CurrencyShop.findAll();
        const embed = new Discord.MessageEmbed()
          .setColor("#59be84")
          .setTitle("Welcome to Sanae's Shop!")
          // .addFields(
          //   { name: "Name", value: `${items.map(item => item.name).join("\n")}`, inline: true },
          //   { name: "Price", value: `${items.map(item => currencyPrefix + item.cost).join("\n")}`, inline: true },
          //   { name: "Description", value: `${items.map(item => item.description).join("\n")}`, inline: true },
          // );
          .setDescription(items.map(item => `**${item.name}** — ${currencyPrefix}${item.cost}\n${item.description}`).join("\n\n"));
        return message.channel.send(embed);
    },
};