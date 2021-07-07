const { prefix, token, defaultCooldown } = require('./config.json');
const { Sequelize } = require('sequelize');
const Discord = require('discord.js'),
	fs = require('fs');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// create schema for poll-prompt command
const Polls = sequelize.define('polls', {
	user: Sequelize.STRING,
	prompt: Sequelize.TEXT,
});

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		if(command.name === 'poll-prompt') {

		}

		// set new item in commands collection. key: command name, value: exported module
		client.commands.set(command.name, command);
	}
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, Polls));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, Polls));
	}
}

client.login(token);