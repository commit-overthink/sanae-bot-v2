const { getVoiceConnection } = require(`@discordjs/voice`);                       
                                                                                  
module.exports = {                                                                
    name: "unpause",                                                                
    description: "Play the music",
    aliases: ["resume", "res"],
    execute(message, args) {                                                      
        const channel = message.member.voice;                                     
        const connection = getVoiceConnection(channel.guild.id);                  
                                                                                  
        if(!connection) {
            return message.channel.send("I'm not in any voice channel right now!");
        }

        message.channel.send("Unpaused!");
        connection.state.subscription.player.unpause();                             
    }                                                                             
} 
