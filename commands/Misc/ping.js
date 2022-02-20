module.exports = {
  name: "ping",
  description: "Ping!",
  aliases: ["uptime", "up", "pong"],
  execute(message) {
    const getUptime = () => {
      const uptime = process.uptime();
      const seconds = Math.floor(uptime % 60);
      const minutes = Math.floor((uptime % (60 * 60)) / 60);
      const hours = Math.floor((uptime / (60 * 60)) % 24);
      const days = Math.floor(uptime / (60 * 60 * 24));
      return { seconds, minutes, hours, days };
    };
    const timeLeft = getUptime();
    let pluralS = "";
    let pluralM = "";
    let pluralH = "";
    let pluralD = "";
    let uptimeMessage = "";
    if (timeLeft.seconds > 1 || timeLeft.seconds === 0) pluralS = "s";
    if (timeLeft.minutes > 1 || timeLeft.minutes === 0) pluralM = "s"; 
    if (timeLeft.hours > 1 || timeLeft.hours === 0) pluralH = "s";
    if (timeLeft.days > 1 || timeLeft.days === 0) pluralD = "s";

    if (timeLeft.seconds > 0) uptimeMessage += `${timeLeft.seconds} second${pluralS}`;
    if (timeLeft.minutes > 0) uptimeMessage += `, ${timeLeft.minutes} minute${pluralM}`;
    if (timeLeft.hours > 0) uptimeMessage += `, ${timeLeft.hours} hour${pluralH}`;
    if (timeLeft.days > 0) uptimeMessage += `, ${timeLeft.days} second${pluralD}`;

    message.channel
      .send(
        `Pong!\n:heartbeat: Websocket heartbeat: ${message.client.ws.ping}ms`
      )
      .then((sent) => {
        sent.edit(
          `Pong!\n:heartbeat: Websocket heartbeat: ${
            message.client.ws.ping
          }ms\n:ping_pong: Roundtrip latency: ${
            sent.createdTimestamp - message.createdTimestamp
          }ms\n:clock1130: Uptime: ${uptimeMessage}`
        );
      });
  },
};
