const { Model, DataTypes } = require('sequelize');
const sequelize = require("../database");


class Shop extends Model { }

Shop.init({
    price: DataTypes.INTEGER
}, {
    sequelize,
    tableName: "shop"
});

module.exports = Shop;