const Discord = require("discord.js");
const { currencyPrefix, defaultEmbedColor } = require("../../config.json");

module.exports = {
  name: "inventory",
  aliases: ["i"],
  description: "Shows the inventory of you or another user.",
  usage: "<@user>",
  useCurrency: true,
  async execute(message, args, currency, Users) {
    const target = message.mentions.users.first() || message.author;
    const user = await Users.findOne({ where: { user_id: target.id } });
    const items = await user.getItems();

    if (!items.length) {
      return message.channel.send(`${target.username} has nothing!`);
    } else {
      let embed = new Discord.MessageEmbed()
        .setColor(defaultEmbedColor)
        .setAuthor(`${target.username}'s Inventory`);
      items.map((i) => {
        embed.addField(
          `${i.item.name}`,
          `Cost: ${currencyPrefix}${i.amount}\n${i.item.description}`
        );
      });
      embed = embed.addField(
        `Wallet`,
        `${currencyPrefix}${currency.getBalance(target.id)}`
      );

      return message.channel.send({ embeds: [embed] });
    }
  },
};
