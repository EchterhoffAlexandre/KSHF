const { Model, DataTypes } = require('sequelize');
const sequelize = require("../database");


class Budget extends Model { }

Budget.init({
    amount: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    color: DataTypes.TEXT,

}, {
    sequelize,
    tableName: "budget"
});

module.exports = Budget;