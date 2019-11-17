'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const UserTransformer = use('App/Transformers/Admin/UserTransformer')
/**
 * OrderTransformer class
 *
 * @class OrderTransformer
 * @constructor
 */
class OrderTransformer extends BumblebeeTransformer {

  static get avaibleInclude(){
    return ['user','coupons','discounts']
  }

  /**
   * This method is used to transform the data.
   */
  transform(order) {
    order = order.toJSON()
    return {
      // add your transformation object here
      id: order.id,
      status: order.status,
      total: order.total ? parseFloat(order.total.toFixed(2)) : 0,
      date: order.created_at,
      // QUando passa pelo toJSON(), o $side_loaded vira __meta__
      qty_items:
        order.__meta__ && order.__meta__qty_items ? order.__meta__qty_items : 0,
      discount:
        order.__meta__ && order.__meta__.discount ? order.__meta__.discount : 0, 
      subtotal:
        order.__meta__ && order.__meta__.subtotal ? order.__meta__.subtotal : 0
    }  
  }

  includeUser(order){
    return this.item(order.getRelated('user'),UserTransformer )
  }

  includeItems(order){
    return this.collection(order.getRelated('items'), OrderItemTransformer )
  }

  includeCoupons(order){
    return this.collection(order.getRelated('coupons'), CouponTransformer )
  }

  includeDiscounts(order){
    return this.item(order.getRelated('discounts'), DiscountTransformer )
  }
}

module.exports = OrderTransformer
