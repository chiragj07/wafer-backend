// Update with your config settings.
const {knexSnakeCaseMappers} = require('objection')
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host:'bt2xejrvtfgult51ebsh-postgresql.services.clever-cloud.com',
      database: 'bt2xejrvtfgult51ebsh',
      user:     'uwhsudctyiuvizlqcmnt',
      password: 'MW0ztqz22xbE9qNgGr2FYnyk7YCMiN'
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

  production:{
    client: 'postgresql',
    connection: {
      host:'bt2xejrvtfgult51ebsh-postgresql.services.clever-cloud.com',
      database: 'bt2xejrvtfgult51ebsh',
      user:     'uwhsudctyiuvizlqcmnt',
      password: 'MW0ztqz22xbE9qNgGr2FYnyk7YCMiN'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    ...knexSnakeCaseMappers
  }

};
