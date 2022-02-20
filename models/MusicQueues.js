const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("MusicQueues", {
    guild: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songList: Sequelize.ARRAY(Sequelize.TEXT),
    isPlaying: Sequelize.BOOLEAN,
    isRepeating: Sequelize.BOOLEAN,
  });
};
