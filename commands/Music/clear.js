const { getVoiceConnection } = require(`@discordjs/voice`);

module.exports = {
    name: "clear",
    description: "Clears the queue.",
    useMusic: true,
    async execute(message, args, MusicQueues) {
        const channel = message.member.voice;
        const connection = getVoiceConnection(channel.guild.id);

        if (!connection) {
            return message.channel.send("I'm not in any voice channel right now!");
        }

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
        queue.songs.push(convertedQueue[0]);

        // Update queue
        try {
            // this if statement exists in order to prevent an empty array from being passed into the database
            MusicQueues.destroy({ where: { guild: message.guild.id } });
            if (queue.songs.length > 0){
                MusicQueues.create({
                    guild: message.guild.id,
                    songs: queue.songs, 
                    isRepeating: false,
                });
            } 
        } catch (e) {
            console.error(e);
        }

        return message.channel.send("I cleared the queue!");
    }
}
