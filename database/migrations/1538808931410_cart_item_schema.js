'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CartItemSchema extends Schema {
    up() {
        this.create('cart_items', table => {
            table.increments()
            table.integer('product_id').unsigned()
            table.integer('qty')
            table.integer('cart_id').unsigned()

            table
                .foreign('product_id')
                .references('id')
                .inTable('products')
                .onDelete('cascade')
            table
                .foreign('cart_id')
                .references('id')
                .inTable('carts')
                .onDelete('cascade')
        })
    }

    down() {
        this.drop('cart_items')
    }
}

module.exports = CartItemSchema
