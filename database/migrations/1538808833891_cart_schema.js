'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CartSchema extends Schema {
    up() {
        this.create('carts', table => {
            table.increments()
            table.decimal('total', 12, 2)
            table.boolean('ordered').defaultTo(false)
            table.integer('user_id').unsigned()

            table
                .foreign('user_id')
                .references('id')
                .inTable('users')
                .onDelete('cascade')
        })
    }

    down() {
        this.drop('carts')
    }
}

module.exports = CartSchema
