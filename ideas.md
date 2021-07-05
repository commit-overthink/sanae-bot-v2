## Ideas

* Random quote/copypasta generator
* Voting system for movies
* Moderation tools (if server ever scales)
* !roll from osu! 
* About command (link to github)
* currency system
* gambling system, where you can bet a certain amount of currency, & a coin flip will determine whether its doubled or lost.
* Uptime command

## Command metadata:

name: <string> name of the command
aliases: <array> a list of alternative command names that the user can use
description: <string> description of the command
args: <boolean> determines whether command arguments are required or not
guildOnly: <boolean> determines whether the command can only be used in a server
cooldown: <int> sets a specific cooldown, default is in config file
usage: <string> shows the command's specific usage
usePrompts: defines if a command uses the Prompt's modal (and hence uses the database)