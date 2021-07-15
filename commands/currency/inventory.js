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

        if(!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(", ")}`);
    },
};