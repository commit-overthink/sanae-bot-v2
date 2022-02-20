const Sequelize = require("sequelize");

// eslint-disable-next-line no-unused-vars
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Users = require("./models/Users")(sequelize, Sequelize.DataTypes);
const CurrencyShop = require("./models/CurrencyShop")(
  sequelize,
  Sequelize.DataTypes
);
const UserItems = require("./models/UserItems")(sequelize, Sequelize.DataTypes);
const Polls = require("./models/Polls")(sequelize, Sequelize.DataTypes);
const MusicQueues = require("./models/MusicQueues")(
  sequelize,
  Sequelize.DataTypes
);

UserItems.belongsTo(CurrencyShop, { foreignKey: "item_id", as: "item" });

Users.prototype.addItem = async function (item) {
  const userItem = await UserItems.findOne({
    where: { user_id: this.user_id, item_id: item.id },
  });

  if (userItem) {
    userItem.amount += 1;
    return userItem.save();
  }

  return UserItems.create({
    user_id: this.user_id,
    item_id: item.id,
    amount: 1,
  });
};

Users.prototype.getItems = function () {
  return UserItems.findAll({
    where: { user_id: this.user_id },
    include: ["item"],
  });
};

module.exports = { Users, CurrencyShop, UserItems, Polls, MusicQueues };
