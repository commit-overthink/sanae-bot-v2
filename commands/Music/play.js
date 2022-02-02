const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, createAudioResource, createAudioPlayer, AudioPlayerStatus, StreamType, NoSubscriberBehavior } = require(`@discordjs/voice`);
const { createReadStream } = require("fs");
const { join } = require("path");

module.exports = {
    name: "play",
    description: "Plays music. Make sure you're in a VC",
    aliases: ["p"],
    execute(message, args) {
        const channel = message.member.voice;
        const joinVC = joinVoiceChannel({
            channelId: channel.channelId,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const connection = getVoiceConnection(channel.guild.id);

        let resource = createAudioResource(createReadStream(join(__dirname, "../../music/Prayerblue.webm")),{
            inlineVolume: true
        });

        resource.volume.setVolume(0.2);

        const player = createAudioPlayer();
        connection.subscribe(player);

        connection.on(VoiceConnectionStatus.Ready, () => {
            player.play(resource);

        });

        player.on(AudioPlayerStatus.Playing, () => {
            message.channel.send(`Now Playing`);
            player.play(resource);
        });
        player.on('error', error => {
        	console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        });
    }
}
