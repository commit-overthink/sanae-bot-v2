const Discord = require("discord.js");
const { getVoiceConnection } = require(`@discordjs/voice`)
const ytdl = require("ytdl-core");
const { defaultEmbedColor } = require("../../config.json");

module.exports = {
    name: "nowplaying",
    description: "Gets the current song and its timestamp.",
    aliases: ["np", "nowp", "now"],
    useMusic: true,
    async execute(message, args, MusicQueues) {
        const channel = message.member.voice;
        const connection = getVoiceConnection(channel.guild.id);

        if (!connection) {
            return message.channel.send("I'm not in any voice channel right now!");
        }

        // === Queue ===
        // create queue object
        let queue = {
            songs: [],
            isRepeating: false,
        }

        // get stored queue
        const getStoredQueue = async () => {
            let storedQueue = null;                                                         
            try {                                                                           
              storedQueue = await MusicQueues.findOne({                                     
                  where: { guild: message.guild.id }                                        
              });                                                                           
            } catch (e) {                                                                   
                console.log(`Error with finding storedQueue. Doesn't exist?`);              
                console.error(e);                                                           
            }                                                                               
            return storedQueue;                                                             
        }

        // push stored queue to queue object
        const storedQueue = await getStoredQueue();

        if (storedQueue === null) {
            return message.channel.send(`${message.member}, no songs have been added yet!`);
        }

        const convertedQueue = storedQueue.dataValues.songs.split(",");
        convertedQueue.forEach((song) => {
            queue.songs.push(song);
        });


        // === Embed ===
        const getSongInfo = async (url) =>
        {                                                                          
            let data = null;
            try {
                data = await ytdl.getBasicInfo(url);
            } catch (e) {
                console.log(`Error with input "${url}". Doesn't exist?`);
            }
            return data;
        }
        
        const parseTime = (time, unit) => {
            let secInt;
            if (unit === "ms") {
                secInt = parseInt(time) / 1000;
            } else {
                secInt = parseInt(time);
            }

            let timestamp = "";
            const s = Math.floor(secInt % 60);
            const min = Math.floor(secInt % (60 * 60) / 60);
            const hr = Math.floor(secInt / (60 * 60) % 24);
            
            // console.log(`time: ${time}, secInt: ${secInt}, sec: ${s}, min: ${min}, hr: ${hr}`);

            if (hr >= 10) timestamp += `${hr}:`;
            else if (hr > 0 && hr < 10) timestamp += `0${hr}:`;

            if (min >= 10 ) timestamp += `${min}:`;
            else if (min > 0 && min < 10) timestamp += `0${min}:`;
            else timestamp += `00:`;

            if (s >= 10) timestamp += `${s}`
            else if (s > 0 && s < 10) timestamp += `0${s}`
            else timestamp += `00`;

            return timestamp;
        }

        const timePlayed = () => {
            const time = connection.state.subscription.player.state.playbackDuration;
            const timestamp = parseTime(time, "ms");
            return [timestamp, time];
        }

        const timeDuration = (duration) => {
            const timestamp = parseTime(duration);
            return timestamp;
        }

        const getEmbed = async (metadata) => {
            const videoData = metadata.videoDetails;
            const [timePlayedStamp, timePlayedMs] = timePlayed();
            const timeDurationStamp = timeDuration(videoData.lengthSeconds);
            
            const timePlayedS = Math.floor(timePlayedMs / 1000);
            const playedPercentage = Math.floor((timePlayedS / videoData.lengthSeconds) * 100);
            const timelinePos = Math.floor(playedPercentage / 5);
            let timeline = "";
            // pos: 5 ----O-----
            // pos: 0 O---------

            for (i=0;i < timelinePos; i++) {
                timeline += "▬";
            }
            timeline += "🔘";
            for (i=timelinePos + 1; i < 20; i++) {
                timeline += "▬"
            }

            console.log(`Time played: ${timePlayedS}, duration: ${videoData.lengthSeconds}, played percentage: ${playedPercentage}`);

            const embed = new Discord.MessageEmbed()
                .setColor(defaultEmbedColor)
                .setTitle(`*"Now playing!"*`)
                .setDescription(`**[${videoData.title}](${videoData.video_url})**`)
                .setThumbnail(`https://i.ytimg.com/vi/${videoData.videoId}/hqdefault.jpg`)
                .addField(`\u200b`, `${timeline}\n\`${timePlayedStamp} / ${timeDurationStamp}\``)
                .addFields(                                                                       
                  {                                                                               
                    name: `Channel`,                                                              
                    value: `${videoData.ownerChannelName}`,                                       
                    inline: true,                                                                 
                  },                                                                              
                  { name: `Views`, value: `${videoData.viewCount}`, inline: true },                       
                  // { name: `Duration`, value: `${videoData.lengthSeconds}`, inline: true },     
                  {                                                                               
                    name: `Upload Date`,                                                          
                    value: `${videoData.publishDate}`,                                            
                    inline: true,                                                                 
                  })
                ;

            return embed;

        }

        const songInfo = await getSongInfo(queue.songs[0]);
        console.log(songInfo);
        const embed = await getEmbed(songInfo);
        message.channel.send({ embeds: [embed] });
    }
}
