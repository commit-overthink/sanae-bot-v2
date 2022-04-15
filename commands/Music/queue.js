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

        const getEmbed = async () => {
            const embed = new Discord.MessageEmbed()
                .setColor(defaultEmbedColor)
                .setTitle(`*"Here's our queue!"*`)
                .setDescription("Music from the Outside World is so different!")
            ;

            // Only allow like 10 songs to be shown max

            let songPlural = "s";
            let lines = "";
            let lastLine = "";
            if (queue.songs.length == 1) songPlural = "";
            for (n in queue.songs) {
                songInfo = await getSongInfo(queue.songs[n]);
                if (n == queue.songs.length - 1) {
                    lastLine = `\n💿 **${queue.songs.length} song${songPlural} in queue**`; 
                }
                if (n == 0) {
                    embed.addField(`__Now Playing__`,`\`${parseInt(n) + 1}.\` [${songInfo.videoDetails.title}](${songInfo.videoDetails.video_url})${lastLine}`);
                } else {
                    lines += `\n\`${parseInt(n) + 1}.\`[${songInfo.videoDetails.title}](${songInfo.videoDetails.video_url})${lastLine}`;
                }
            }
            if (lines.length > 0) embed.addField(`__Next Up__`, lines); 
            return embed;
        }

        embed = await getEmbed();
        return message.channel.send({ embeds: [embed] });
    }
}
