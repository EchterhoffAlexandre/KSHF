const { Sequelize } = require('sequelize');

const PG_URL = process.env.DATABASE_URL || "postgres://admin_kshf:kshf@localhost:5432/kshf";

const defineAttributes = {
    define: {
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
}

const sequelize = new Sequelize(PG_URL, defineAttributes) // Example for postgres

module.exports = sequelize;