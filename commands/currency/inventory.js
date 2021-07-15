const Discord = require("discord.js");
const { defaultEmbedColor } = require("../../config.json");

module.exports = {
    name: "inventory",
    aliases: ["i"],
    description:
      "Shows the inventory of you or another user.",
      usage: "<@user>",
    useCurrency: true,
    async execute(message, args, currency, Users) {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        if (!items.length) {
          return message.channel.send(`${target.tag} has nothing!`);
        } else {
          const embed = new Discord.MessageEmbed()
            .setColor(defaultEmbedColor)
            .setAuthor(`${target.tag}'s Inventory`)
            .setDescription("Owned Items\n" + items.map(i => `**${i.item.name}** — ${i.amount}\n${i.item.description}`).join("\n\n"));
            return message.channel.send(embed);
        }
    },
};