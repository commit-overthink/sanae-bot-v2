## Up next:

* Fortifying polls commands from abuse
* Making polls system more semantic, with any amount of emoji's acceptable (with a max amount of course)

## Ideas

* Random quote/copypasta generator
* Voting system for movies
* Moderation tools (if server ever scales)
* Gambling system, where you can bet a certain amount of currency, & a coin flip will determine whether its doubled or lost.
* Uptime command
* (CURRENCY SYSTEM) buy fumo pngs in gambling system, daily commands that give allowance, redeemables (like from Twitch channel points) such as special roles, predictions (also like from twitch)
* Roll command shows a graphic of a die.

## Notes

For creating roles manager: https://www.reddit.com/r/Discordjs/comments/m4qr8i/how_to_have_reaction_collector_run_infinitely_or/

## Config.json

prefix: <string> the prefix that the bot scans messages for to recieve commands
token: <string> the bot's token for connecting to Discord
defaultCooldown: <int> default command cooldown
maxPollTime: <int> maximum time poll-start can be run for

## Command metadata:

name: <string> name of the command
aliases: <array> a list of alternative command names that the user can use
description: <string> description of the command
args: <boolean> determines whether command arguments are required or not
guildOnly: <boolean> determines whether the command can only be used in a server
cooldown: <int> sets a specific cooldown, default is in config file
usage: <string> shows the command's specific usage
usePrompts: defines if a command uses the Prompt's modal (and hence uses the database)