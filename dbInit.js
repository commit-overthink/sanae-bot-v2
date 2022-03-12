const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const CurrencyShop = require("./models/CurrencyShop")(
  sequelize,
  Sequelize.DataTypes
);
require("./models/Users")(sequelize, Sequelize.DataTypes);
require("./models/UserItems")(sequelize, Sequelize.DataTypes);
require("./models/Polls")(sequelize, Sequelize.DataTypes);
require("./models/MusicQueues")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
  .sync({ force })
  .then(async () => {
    const shop = [
      CurrencyShop.upsert({
        name: "Yuyuko Fumo",
        description: "The most superior fumo. The worthy may possess it.",
        cost: 1000000,
      }),
      CurrencyShop.upsert({
        name: "Reimu Fumo",
        description: "A real classic.",
        cost: 5000,
      }),
      CurrencyShop.upsert({
        name: "Marisa Fumo",
        description: "A real classic.",
        cost: 5000,
      }),
      CurrencyShop.upsert({
        name: "Sakuya Fumo",
        description: "A real classic.",
        cost: 5000,
      }),
      CurrencyShop.upsert({
        name: "Cirno Fumo",
        description: "The most powerful fumo.",
        cost: 9999,
      }),
      CurrencyShop.upsert({
        name: "Youmu Fumo",
        description: "A premium fumo, for a more premium price.",
        cost: 300000,
      }),
      CurrencyShop.upsert({ name: "Honey", description: "Yum", cost: 100 }),
      CurrencyShop.upsert({
        name: "Glock 19",
        description: "For when danmaku just isn't enough.",
        cost: 500,
      }),
      CurrencyShop.upsert({
        name: "Spell Card",
        description: "I summom Icicle Fall -Easy- in defense position.",
        cost: 100000,
      }),
      CurrencyShop.upsert({
        name: "Hakurei Shrine Donation Certificate",
        description: "Simp for Reimu.",
        cost: 500,
      }),
      CurrencyShop.upsert({
        name: "Moriya Shrine Donation Certificate",
        description: "Simp for Sanae.",
        cost: 500,
      }),
      CurrencyShop.upsert({
        name: "Patchouli's Book",
        description: "The very sight of it sends shivers down your spine.",
        cost: 100000,
      }),
      CurrencyShop.upsert({
        name: "Mosquito Coil",
        description: "Useful for nightly walks",
        cost: 500,
      }),
      CurrencyShop.upsert({
        name: "Mystia's Box of Fried Eels",
        description: "Cures night-blindness (supposedly)",
        cost: 600,
      }),
      CurrencyShop.upsert({
        name: "Reisen Bunny Cap",
        description: "Mad as a hatter!",
        cost: 1000,
      }),
      CurrencyShop.upsert({
        name: "False Moon",
        description: "Whoa. One helluva souvenir.",
        cost: 1000000000,
      }),
      CurrencyShop.upsert({
        name: "Strange Communications Device",
        description: "Found near a geyser.",
        cost: 500,
      }),
      CurrencyShop.upsert({
        name: "Flandre Cola",
        description: "https://www.youtube.com/watch?v=dNKMUiB-vKw",
        cost: 500,
      }),
      CurrencyShop.upsert({
        name: "Alice's Doll",
        description: "It's power is only 28.5714% as much as yours.",
        cost: 285714,
      }),
    ];
    await Promise.all(shop);
    console.log("Database synced");
    sequelize.close();
  })
  .catch(console.error);
