const { getVoiceConnection } = require(`@discordjs/voice`);                       
                                                                                  
module.exports = {                                                                
    name: "unpause",                                                                
    description: "Play the music",
    aliases: ["resume"],
    execute(message, args) {                                                      
        const channel = message.member.voice;                                     
        const connection = getVoiceConnection(channel.guild.id);                  
                                                                                  
        connection.state.subscription.player.unpause();                             
    }                                                                             
} 
