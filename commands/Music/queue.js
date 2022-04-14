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

            const firstSongInfo = await getSongInfo(queue.songs[0]);
                 embed.setThumbnail(
                     `https://i.ytimg.com/vi/${firstSongInfo.videoDetails.videoId}/maxresdefault.jpg`
                 );

            let songPlural = "s";
            let lastLine = "";
            if (queue.songs.length == 1) songPlural = "";
            // embed.addField(`__Now Playing__`, '\u200b');
            for (n in queue.songs) {
                if (n < 2) {
                    let nextUpTitle = "";
                    if (n == 0) nextUpTitle = "__Now Playing__";
                    if (n == 1) nextUpTitle = "__Next Up__";
                    songInfo = await getSongInfo(queue.songs[n]);
                    embed.addField(`${nextUpTitle}\u200b`,`\`${parseInt(n) + 1}.\` [${songInfo.videoDetails.title}](${songInfo.videoDetails.video_url})${lastLine}`);
                } else {
                    let lines = "";
                    if (n == queue.songs.length - 1) lastLine = `\n**${queue.songs.length} song${songPlural} in queue**`; 
                    // embed.addField(`${nextUpTitle}\u200b`,`\`${parseInt(n) + 1}.\` [${songInfo.videoDetails.title}](${songInfo.videoDetails.video_url})${lastLine}`);

                }
            }


            return embed;
        }

        embed = await getEmbed();
        return message.channel.send({ embeds: [embed] });
    }
}
