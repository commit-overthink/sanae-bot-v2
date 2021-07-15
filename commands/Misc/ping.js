module.exports = {
	name: "ping",
	description: "Ping!",
	execute(message) {
		message.channel.send(`:heartbeat: Websocket heartbeat: ${message.client.ws.ping}ms`).then(sent => {
			sent.edit(`:heartbeat: Websocket heartbeat: ${message.client.ws.ping}ms\n:ping_pong: Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
		});
	},
};