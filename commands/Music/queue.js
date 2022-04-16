const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { defaultEmbedColor } = require("../../config.json");

module.exports = {
    name: "queue",
    description: "Shows you the current music queue.",
    aliases: ["q", "qeueu", "qewuewuwuuwe"],
    useMusic: true,
    async execute(message, args, MusicQueues) {
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

        // make embed
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

        //=== Time ===
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
        
        const getEmbed = async () => {
            const embed = new Discord.MessageEmbed()
                .setColor(defaultEmbedColor)
                .setTitle(`*"Here's our queue!"*`)
                .setDescription("Music from the Outside World is so different!")
            ;

            // Only allow like 10 songs to be shown max

            let songPlural = "s";
            let queueDuration = 0;
            let lines = "";
            let lastLine = "";
            if (queue.songs.length == 2) songPlural = "";
            for (n in queue.songs) {
                songInfo = await getSongInfo(queue.songs[n]);
                queueDuration += parseInt(songInfo.videoDetails.lengthSeconds);
                if (n == queue.songs.length - 1) {
                    queueDurationStamp = parseTime(queueDuration);
                    lastLine = `\n💿 **${queue.songs.length - 1} song${songPlural} in queue** | ${queueDurationStamp}`; 
                }
                if (n == 0) {
                    embed.addField(`__Now Playing__`,`[${songInfo.videoDetails.title}](${songInfo.videoDetails.video_url})${lastLine}`);
                } else {
                    lines += `\n\`${parseInt(n)}.\`[${songInfo.videoDetails.title}](${songInfo.videoDetails.video_url})${lastLine}`;
                }
            }
            if (lines.length > 0) embed.addField(`__Next Up__`, lines); 
            return embed;
        }

        embed = await getEmbed();
        return message.channel.send({ embeds: [embed] });
    }
}
