const { Model, DataTypes } = require('sequelize');
const sequelize = require("../database");


class Transaction extends Model { }

Transaction.init({
    amount: DataTypes.DECIMAL,
    name: DataTypes.TEXT

}, {
    sequelize,
    tableName: "transaction"
});

module.exports = Transaction;