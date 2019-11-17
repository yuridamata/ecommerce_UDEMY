'use strict'

class AdminStoreOrder {
  get rules () {
    return {
      // validation rules
      'items.*.product_id': ''
    }
  }
}

module.exports = AdminStoreOrder
