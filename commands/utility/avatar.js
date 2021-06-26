const { UserFlags } = require("discord.js");
const { guildOnly } = require("./args-info");

module.exports = {
    name: "avatar",
    aliases: ["icon", "pfp"],
    description: "Sends you your avatar as an image.",
    usage: "@<users>",
    execute(message, args) {
        if (args[0]) {
            const taggedUser = message.mentions.users.first();
            const avatarList = message.mentions.users.map(user => {
                return `${user.username}'s avatar: ${user.avatarURL({format: "jpg", size: 256})}`;
            })
            
            return message.channel.send(avatarList);
        }

        return message.channel.send(message.author.avatarURL({format: "jpg", size: 256}));
    },
};