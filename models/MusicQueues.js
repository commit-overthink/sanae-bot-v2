const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("MusicQueues", {
    guild: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songs: Sequelize.ARRAY(Sequelize.TEXT),
    isRepeating: Sequelize.BOOLEAN,
  });
};
