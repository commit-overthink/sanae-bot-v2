const { getVoiceConnection } = require(`@discordjs/voice`);

module.exports = {
    name: "stop",
    description: "Stops the music, you don't want your parents to hear this kind of stuff... right?",
    aliases: ["disconnect", "leave", "quit"],
    execute(message, args) {
        const channel = message.member.voice;
        const connection = getVoiceConnection(channel.guild.id);

        if (!connection) {
            return message.channel.send("I'm not in any voice channel right now!");
        }
        return connection.destroy();
    }
}
