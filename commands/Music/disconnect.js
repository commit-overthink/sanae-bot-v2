const { getVoiceConnection } = require(`@discordjs/voice`);

module.exports = {
    name: "disconnect",
    description: "also temp",
    execute(message, args) {
        const channel = message.member.voice;
        const connection = getVoiceConnection(channel.guild.id);

        console.log(connection)
        if (!connection) {
            return message.channel.send("I'm not in any voice channel right now!");
        }
        return connection.destroy();
    }
}
