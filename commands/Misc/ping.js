module.exports = {
	name: "ping",
	description: "Ping!",
    aliases: ["uptime", "up", "pong"],
	execute(message) {
        const getUpTime = () => {
            const uptime = process.uptime();
            const seconds = Math.floor(uptime % 60);
            const minutes = Math.floor(uptime % (60*60) / 60);
            const hours = Math.floor(uptime / (60*60));
            const days = Math.floor(uptime / (60*60*24));
            return ({ seconds, minutes, hours, days });
        }
        const upTime = getUpTime();
        let pluralS = "";
        let pluralM = "";
        let pluralH = "";
        let pluralD = "";

        if (upTime.seconds > 1 || upTime.seconds === 0) {
            pluralS = "s";
        }
        if (upTime.minutes > 1 || upTime.minutes === 0) {
            pluralM = "s";
        }
        if (upTime.hours > 1 || upTime.hours === 0) {
            pluralH = "s";
        }
        if (upTime.days > 1 || upTime.days === 0) {
            pluralD = "s";
        }
        message.channel.send(`Pong!\n:heartbeat: Websocket heartbeat: ${message.client.ws.ping}ms`).then(sent => {
			sent.edit(`Pong!\n:heartbeat: Websocket heartbeat: ${message.client.ws.ping}ms\n:ping_pong: Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms\n:clock1130: Uptime: ${upTime.seconds} second${pluralS}, ${upTime.minutes} minute${pluralM}, ${upTime.hours} hour${pluralH}, ${upTime.days} day${pluralD}`);
		});
	},
};
