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
        const getSongInfo = async (url) => {                                                                          
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
                .setDescription("Music from the Outside World is so different, Akyuu!")
            ;

             const firstSongInfo = await getSongInfo(queue.songs[0]);
                 embed.setThumbnail(
                     `https://i.ytimg.com/vi/${firstSongInfo.videoDetails.videoId}/maxresdefault.jpg`
                 );
            for (n in queue.songs) {
                songInfo = await getSongInfo(queue.songs[n]);
                embed.addField(`__${parseInt(n) + 1}:__`,`${songInfo.videoDetails.title}\n${songInfo.videoDetails.ownerChannelName}`);
            }

            return embed;
        }

        embed = await getEmbed();
        return message.channel.send({ embeds: [embed] });
    }
}
