const { Model, DataTypes } = require('sequelize');
const sequelize = require("../database");

class UserQuest extends Model {}

UserQuest.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    quest_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Quest',
            key: 'id',
        },
    },
    state: DataTypes.INTEGER,
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize,
    tableName: "user_has_quest",
    primaryKey: ['user_id', 'quest_id'],
});

module.exports = UserQuest;
