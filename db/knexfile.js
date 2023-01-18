// Update with your config settings.
const {knexSnakeCaseMappers} = require('objection')
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'users',
      user:     'wafers',
      password: 'krishna08'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    ...knexSnakeCaseMappers
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'users',
      user:     'wafers',
      password: 'krishna08'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
    ,
    ...knexSnakeCaseMappers
  }

};
