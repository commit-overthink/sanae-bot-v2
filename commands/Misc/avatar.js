module.exports = {
	name: "avatar",
	aliases: ["icon", "pfp"],
	description: "Sends you your avatar as an image.",
	usage: "@<users>",
	execute(message, args) {
		if (args[0]) {
			const avatarList = message.mentions.users.map((user) => {
				if (user.username === "Sanae" || user.username === "Sanae-dev") {
					return `My avatar! ${user.avatarURL({
						format: "jpg",
						size: 256,
					})}`;
				}
				else {
					return `${user.username}'s avatar: ${user.avatarURL({
						format: "jpg",
						size: 256,
					})}`;
				}
			});
			return message.channel.send(avatarList);
		}

		return message.channel.send(message.author.avatarURL({ format: "jpg", size: 256 }));
	},
};