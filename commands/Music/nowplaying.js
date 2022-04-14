const { getVoiceConnection } = require(`@discordjs/voice`)

module.exports = {
    name: "nowplaying",
    description: "Gets the current song and its timestamp.",
    aliases: ["np", "nowp", "now"],
    useMusic: true,
    execute(message, args, MusicQueues) {
        const channel = message.member.voice;
        const connection = getVoiceConnection(channel.guild.id);

        if (!connection) {
            return message.channel.send("I'm not in any voice channel right now!");
        }

        // get current song
        const time = connection.state.subscription.player.state.playbackDuration
        console.log(time);
        message.channel.send("*Shows the current song without any errors*");
        message.channel.send(`Time: ${time / 1000} seconds`);


    }
}
