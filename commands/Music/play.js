const Discord = require("discord.js");
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, createAudioResource, createAudioPlayer, AudioPlayerStatus, StreamType, NoSubscriberBehavior } = require(`@discordjs/voice`);
const { createReadStream } = require("fs");
const { join } = require("path");
const ytdl = require("ytdl-core");
const { defaultEmbedColor } = require("../../config.json");

module.exports = {
    name: "play",
    description: "Plays music. Make sure you're in a VC",
    aliases: ["join", "p"],
    args: true,
    usage: "<YouTube URL>",
    async execute(message, args) {

        const getMetadata = async (url) => {
            // metadata is set to null for now for a later check to see if the song exists
            let metadata = null;
            try {
                metadata = await ytdl.getBasicInfo(url);
            } catch (e) {
                console.error(e);
            }
            return metadata;
        }

        const getNowPlayingEmbed = (metadata) => {
            const videoData = metadata.videoDetails;

            const durationMinutes = `${Math.floor(videoData.lengthSeconds % (60*60) / 60)}:${Math.floor(videoData.lengthSeconds % 60)}`;
            const durationHours = `${Math.floor(videoData.lengthSeconds / (60*60))}:${Math.floor(videoData.lengthSeconds % (60*60) / 60)}:${Math.floor(videoData.lengthSeconds % 60)}`;
            let duration;
            if (videoData.lengthSeconds > 3600) {
                duration = durationHours;
            } else {
                duration = durationMinutes;
            }

            const embed = new Discord.MessageEmbed()
                .setColor(defaultEmbedColor)
                .setTitle(`*"Now playing!"*`)
                .setDescription(`**[${videoData.title}](${videoData.video_url})**`)
                .setThumbnail(`https://i.ytimg.com/vi/${videoData.videoId}/maxresdefault.jpg`)
                .addFields(
                    { name: `Channel`, value: `${videoData.ownerChannelName}`, inline: true },
                    { name: `Duration`, value: `${duration}` , inline: true },
                    // { name: `Duration`, value: `${videoData.lengthSeconds}`, inline: true },
                    { name: `Upload Date`, value: `${videoData.publishDate}`, inline: true },
                    // { name: "Position in queue", value: ""}
                )
                ;
            return embed;
        }

        // Check to see if the song exists
        metadata = await getMetadata(args[0]);
        if (metadata === null) {
            return message.channel.send("Sorry, but Akyuu couldn't find this song!");
        }

        const channel = message.member.voice;
        joinVoiceChannel({
            channelId: channel.channelId,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const connection = getVoiceConnection(channel.guild.id);

        if (channel.channel === null) {
            return message.channel.send("Please join a voice channel!");
        }

        // Don't create another subscription if it already exists
        if(connection.state.subscription){
            return message.channel.send("Akyuu is already playing the music!");
        }


        const audioStream = ytdl(`${args[0]}`, { filter: `audioonly`, highWaterMark: 1 << 25 });
        let resource = createAudioResource(audioStream, { inputType: StreamType.Arbitrary });
        // let resource = createAudioResource(createReadStream(join(__dirname, "../../music/music.mp3")));

        const player = createAudioPlayer();
        connection.subscribe(player);

        connection.on(VoiceConnectionStatus.Ready, () => {
            player.play(resource);
        });

        player.on(AudioPlayerStatus.Playing, () => {
            const embed = getNowPlayingEmbed(metadata);
            message.channel.send({ embeds: [embed] });
            player.play(resource);
        });
        player.on('error', error => {
        	console.error(`Error: ${error.message} with resource ${metadata.videoDetails.title}`);
        });
    }
}
