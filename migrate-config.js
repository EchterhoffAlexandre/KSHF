module.exports = {
    connectionString: process.env.DATABASE_URL,
    migrationsDir: 'migrations/deploy',
    migrationTableName: 'migrations',
};