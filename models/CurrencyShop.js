module.exports = (sequelize, DataTypes) => {
    return sequelize.define("currency_shop", {
        name: {
            type: DataTypes.STRING,
            unqiue: true,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};