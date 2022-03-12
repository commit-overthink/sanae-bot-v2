const Discord = require("discord.js");
const { getVoiceConnection } = require(`@discordjs/voice`);
const { defaultEmbedColor } = require("../../config.json");

module.exports = {
    name: "skip",
    description: "Skips to the next song.",
    aliases: ["s"],
    useMusic: true,
    async execute(message, args, MusicQueues) {
        const activeChannel = message.member.voice;
        const connection = getVoiceConnection(activeChannel.guild.id);

        // Puts player in idle state. Currently playing song is already removed from stored queue.
        connection.state.subscription.player.stop();
        return message.channel.send("Skipped! :fast_forward:");
    }
}
