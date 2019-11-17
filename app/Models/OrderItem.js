'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderItem extends Model {

    static boot(){
        super.boot()
        this.addHook('beforeSave', 'OrderItemHook.updateSubtotal');
    }

    static get traits(){
        return [
            'App/Models/Traits/NoTimestamp'
        ]
    }

    product(){
        return this.belongsTo('App/Model/Product')
    }

    order()    {
        return this.belongsTo('App/Model/Order')
    }

}

module.exports = OrderItem
