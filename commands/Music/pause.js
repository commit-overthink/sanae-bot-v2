const { getVoiceConnection } = require(`@discordjs/voice`);

module.exports = {
    name: "pause",
    description: "I'll pause the music, but make sure I'm in your channel first.",
    execute(message, args) {
        const channel = message.member.voice;
        const connection = getVoiceConnection(channel.guild.id);

        if(!connection) {
            return message.channel.send("I'm not in any voice channel right now!");
        }
        message.channel.send("The music is paused, please wait warmly.");
        connection.state.subscription.player.pause();
    }
}
