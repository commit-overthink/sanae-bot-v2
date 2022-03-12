const { getVoiceConnection } = require(`@discordjs/voice`);

module.exports = {
  name: "stop",
  description:
    "Stops the music, you don't want your parents to hear this kind of stuff... right?",
  aliases: ["disconnect", "leave", "quit"],
  useMusic: true,
  execute(message, args, MusicQueues) {
    const channel = message.member.voice;
    const connection = getVoiceConnection(channel.guild.id);

    if (!connection) {
      return message.channel.send("I'm not in any voice channel right now!");
    }
    
    MusicQueues.destroy({ where: { guild: message.guild.id } });
    connection.destroy();

    return message.channel.send(`See you later ${message.member}!`);
  },
};
