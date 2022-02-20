const Discord = require("discord.js");
const { currencyPrefix, defaultEmbedColor } = require("../../config.json");

module.exports = {
  name: "leaderboard",
  description: "See who has more money than you!",
  useCurrency: true,
  execute(message, args, currency) {
    embed = new Discord.MessageEmbed()
      .setTitle("Leaderboard")
      .setColor(defaultEmbedColor);
    currency
      .sort((a, b) => b.balance - a.balance)
      .filter((user) => message.client.users.cache.has(user.user_id))
      .first(10)
      .map((user, position) =>
        embed.addField(
          `-- ${position + 1} -- `,
          `${
            message.client.users.cache.get(user.user_id).tag
          } — ${currencyPrefix}${user.balance}`
        )
      );

    return message.channel.send({ embeds: [embed] });
    // return message.channel.send("There are no users on the leaderboard ;-;");
  },
};
