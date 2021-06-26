module.exports = {
    name: "args-info",
    description: "Test command. Type 'test' as an argument.",
    args: true,
    guildOnly: true,
    cooldown: 5,
    usage: "<argument>",
    execute(message, args) {
        if(args[0] === 'test') {
            return message.channel.send('Eyy');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};