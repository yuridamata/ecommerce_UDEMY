'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

const CouponTransformer = use('App/Transformers/Admin/CouponTransformer')
/**
 * DiscountTransformer class
 *
 * @class DiscountTransformer
 * @constructor
 */
class DiscountTransformer extends BumblebeeTransformer {

  static get defaultInclude(){
    return ['coupon']
  }

  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
     // add your transformation object here
      id: model.id,
      amout: model.discount
    }
  }

  includeCoupon(discount){
    return this.item(discount.getRelated('coupon'), CouponTransformer)
  }
}

module.exports = DiscountTransformer
