'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {

    image(){
        return this.belongsTo('App/Models/Image')
    }

    /**
     *  Relacionamento de produto e galeria de imagens
     * 
     */

    images(){
        this.belongsToMany('App/Models/Image')
    }

    /**
     *  Relacionamento entre produtos e categorias
     * 
     */

     categories(){
         return this.belongsToMany('App/Models/Category')
     }

     /**
      *  Relacionamento com cupons
      * 
      */

    coupons(){
        return this.belongsToMany("App/Models/Coupon")
    }
}

module.exports = Product
