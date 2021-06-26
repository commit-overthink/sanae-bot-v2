const { prefix } = require("../../config.json");

module.exports = {
    name: "help",
    description: "A list of all of the commands you can use, or info about a certain command.",
    aliases: ["commands"],
    usage: "<command name>",
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if(!args.length) {
            data.push("Here's a list of all my commands:\n");
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help <command name>\` to get more info about a specific command.`);

            return message.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if(!command) {
            return message.reply("Sorry, that's not a command!");
        }

        data.push(`**Name:** ${command.name}`);
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        data.push(`**Cooldown:** ${command.cooldown || 3} seconds`);

        message.channel.send(data, { split: true });
    },
};