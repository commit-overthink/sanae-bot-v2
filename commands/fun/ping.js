module.exports = {
    name: "ping",
    description: "Ping!",
    execute(message, args) {
      // prettier-ignore
      //   message.channel.send(`:ping_pong: **Latency:** ${message.client.ws.ping}ms`);
      message.channel.send(`:heartbeat: Websocket heartbeat: ${message.client.ws.ping}ms`).then(sent => {
            sent.edit(`:heartbeat: Websocket heartbeat: ${message.client.ws.ping}ms\n:ping_pong: Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
        })
    },
};