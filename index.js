const { token, defaultFunds } = require("./config.json");
const { Client, Collection, Intents } = require("discord.js"),
  fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const { Users, CurrencyShop, Polls } = require("./dbObjects");
// const { Op } = require("sequelize");

client.commands = new Collection();
client.cooldowns = new Collection();
const currency = new Collection();

const commandFolders = fs.readdirSync("./commands");
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

  // Currency system helper methods
  let running = false;

  Reflect.defineProperty(currency, "add", {
    value: async function add(id, amount) {
      if (!running) {
        running = true;
        const user = currency.get(id);
        if (user) {
          user.balance += Number(amount);
          running = false;
          return user.save();
        }
        console.log(id, amount);
        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);
        running = false;
        return newUser;
      }
    },
  });

  Reflect.defineProperty(currency, "getBalance", {
    value: function getBalance(id) {
      const user = currency.get(id);
      // return user ? user.balance : 0;
      if (user) {
        return user.balance;
      } else {
        currency.add(id, defaultFunds);
        return 10;
      }
    },
  });

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);

    // set new item in commands collection. key: command name, value: exported module
    client.commands.set(command.name, command);
  }
}
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, Users, currency));
  } else {
    client.on(event.name, (...args) => event.execute(...args, Polls, Users, CurrencyShop, currency));
  }
}

client.login(token);
