const { Model, DataTypes } = require('sequelize');
const sequelize = require("../database");


class Family extends Model { }

Family.init({
    name: DataTypes.TEXT,
    level: DataTypes.INTEGER
}, {
    sequelize,
    tableName: "family"
});

module.exports = Family;