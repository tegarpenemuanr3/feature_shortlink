// knexfile.js
const config = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "12345678",
      database: "shortlinks",
    },
    // migrations: {
    //   tableName: "knex_migrations",
    //   directory: "./migrations",
    // },
    // seeds: {
    //   directory: "./seeds",
    // },
  },
  // add additional environments here
};

export default config;
