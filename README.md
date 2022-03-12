# Sanae

A discord bot that I use in private servers for fun. The roadmap has been moved to the Projects tab.

## Notes

[For creating roles manager](https://www.reddit.com/r/Discordjs/comments/m4qr8i/how_to_have_reaction_collector_run_infinitely_or/)

## Config.json

prefix: (string) the prefix that the bot scans messages for to recieve commands

currencyPrefix: (string) the prefix used for Sanae's currency system

token: (string) the bot's token for connecting to Discord

defaultEmbedColor: (string) the hex value of the default color for embed messages.

defaultCooldown: (int) default command cooldown

minPollTime: (int) minimum seconds poll-start can be run for

maxPollTime: (int) maximum seconds poll-start can be run for

defaultFunds: (int) the amount of currency every user gets by default

## Command metadata

name: (string) name of the command

aliases: (array) a list of alternative command names that the user can use

description: (string) description of the command

args: (boolean) determines whether command arguments are required or not

guildOnly: (boolean) determines whether the command can only be used in a server

cooldown: (int) sets a specific cooldown, default is in config file

usage: (string) shows the command's specific usage

usePolls: (boolean) defines if a command uses the Polls models (and hence uses the database)

useCurrency: (boolean) defines if a command uses the currency models (and hence uses the database)

useMusic: (boolean) defines if a command uses the Music model (and hence uses the database)
