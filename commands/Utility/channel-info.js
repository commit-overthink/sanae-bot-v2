module.exports = {
  name: "channel-info",
  description: "Shows info about the current channel.",
  aliases: ["cinfo"],
  execute(message) {
    if (message.channel.topic === null) {
      message.channel.send(`Channel Name: \`${message.channel.name}\``);
    } else {
      message.channel.send(
        `Channel Name: \`${message.channel.name}\`\nChannel Description: \`${message.channel.topic}\``
      );
    }
  },
};
