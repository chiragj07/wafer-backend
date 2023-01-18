/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
    return knex.schema.createTable('users', (table)=>{
        table.increments();
        table.string('first name').notNullable();
        table.string('last name').notNullable();
        table.string('email').notNullable().unique();
        table.string('phone').notNullable().unique();
    }).createTable('phoneotp', (table)=>{
        table.increments();
        table.string('phone').notNullable().unique();
        table.string('otp')
        table.timestamps(true,true);

    }).createTable('emailotp', (table)=>{
        table.increments();
        table.string('email').notNullable().unique();
        table.string('otp')
        table.timestamps(true,true);

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

    return knex.schema.dropTableIfExists('users').dropTableIfExists('phoneOTP').dropSchemaIfExists('emailOTP')
  
};
