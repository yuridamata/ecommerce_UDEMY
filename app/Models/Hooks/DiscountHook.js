'use strict'

const DiscountHook = (exports = module.exports = {})
const Coupon = use('App/Models/Coupon')
const Order = use('App/Models/Order')
const Database = use('Database')


DiscountHook.calculateValues = async model => {
  var couponProducts,
    discountItems = []
  model.discount = 0

  const coupon = await Coupon.find(model.coupon_id)
  const order = await Order.find(model.order_id)

  switch (coupon.can_use_for) {
    case 'product_client' || 'product':
      couponProduct = await Database.from('coupon_product')
        .where('coupon_id', model.coupon_id)
        .pluck('product_id')
      discountItems = await Database.from('ordem_items')
        .where('coupon_id', model.coupon_id)
        .whereIn('product_id', couponProducts)
        .pluck('product_id')
      if(coupon.type == 'percent'){
        for(let orderItem of discountItems){
          model.discount += (orderitem.subtotal / 100) * coupon.discount;
        }        
      }else if(coupon.type == 'currency'){
        for(let orderItem of discountItems){
          model.discount += coupon.discount * orderItem.quantity;
        }
      }else{ // Se for do tipo 'free'
        for(let orderItem of discountItems){
          model.discount += orderItem.subtotal;  
        }
      }
      break
    default:

      //client || all
      if(coupon.type == 'percent'){
        model.discount = (order.subtotal / 100) * coupon.discount;
      }else if(coupon.type == 'currency'){
        model.discount = coupon.discount 
      }else{
        //free coupon
        model.discount = order.subtotal;
      }
      break
  }

  //Decrementa quantidade de cupons disponíveis para uso
  DiscountHook.decrementCoupons = async model => {
    const query = Database.from('coupons');
    if(model.$transaction){
      query.transacting(model.$transaction);
    }
    await query.where('id', model.coupon_id).decrement('quantity',1)

  }

  DiscountHook.incrementCoupons =  async model => {
    if(model.$transaction){
      query.transacting(model.$transaction)
    }
    await query.where('id',model.coupon_id).increment('quantity', 1);
  }

}
