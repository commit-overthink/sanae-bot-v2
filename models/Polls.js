// const Polls = sequelize.define("polls", {
//     user: Sequelize.STRING,
//     prompt: Sequelize.TEXT,
//     isRunningPoll: {
//       type: Sequelize.BOOLEAN,
//       defaultValue: false,
//     },
//     options: Sequelize.ARRAY(Sequelize.TEXT),
//   });

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "polls",
    {
      user: DataTypes.STRING,
      prompt: DataTypes.TEXT,
      isRunningPoll: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      options: DataTypes.ARRAY(DataTypes.TEXT),
    },
    {
      timestamps: false,
    }
  );
};
