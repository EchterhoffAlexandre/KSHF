const { Model, DataTypes } = require('sequelize');
const sequelize = require("../database");


class Quest extends Model { }

Quest.init({
    description: DataTypes.TEXT,
    difficulty: DataTypes.INTEGER,
    reward_exp: DataTypes.INTEGER,
    reward_coin: DataTypes.INTEGER
}, {
    sequelize,
    tableName: "quest"
});

module.exports = Quest;