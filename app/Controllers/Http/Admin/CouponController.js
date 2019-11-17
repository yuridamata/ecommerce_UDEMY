'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Coupon = use('App/Models/Coupon')
const Database = use('Database')
const Service = use('App/Services/CouponService')

const Transformer = use('App/Transformers/Admin/CouponTransformer')

/**
 * Resourceful controller for interacting with coupons
 */
class CouponController {
  /**
   * Show a list of all coupons.
   * GET coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, pagination, transform }) {
    const code = request.input('code')
    const query = Coupon.query()
    if (code) {
      query.where('code', 'LIKE', `%${code}%`)
    }
    var coupons = await query.paginate(pagination.page, pagination.limit)
    coupons = await transform.paginate(coupons, transform)
    return response.send(coupons)
  }

  /**
   * Create/save a new coupon.
   * POST coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    /**
     *   1 - produto - pode ser utilizado apenas em produtos específicos
     *   2 - clients - pode ser utilizado apenas por clientes específicos
     *   3 - clients e products
     *   4 - Pode ser utilizado por qualquer cliente em qualquer pedido
     */

    var can_use_for = {
      client: false,
      product: false
    }
    const trx = await Database.beginTransaction()

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type',
        'recursive'
      ])
      const { users, products } = request.only(['users', 'products'])
      var coupon = await Coupon.create(couponData, trx)

      //starts service layer
      const service = new Service(coupon, trx)

      if (users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      if (products && products.length > 0) {
        await service.syncProducts(users)
        can_use_for.Product = true
      }

      if (can_use_for.products && can_use_for.client) {
        coupon.can_use_for = 'product_client'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'product'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()

      coupon = await transform.item(coupon, Transformer)
      return response.status(201).send(coupon)
    } catch (error) {
      await trx.rollback()
      return response
        .status(400)
        .send({ message: 'Não foi possível criar o coupon no momento' })
    }
  }

  /**
   * Display a single coupon.
   * GET coupons/:id
   *module
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, transform }) {
    var coupon = await Coupon.findOrFail(id)
    coupon = await transform
      .include('products,users,orders')
      .item(coupon, Transformer)
    return response.send(coupon)
  }

  /**
   * Update coupon details.
   * PUT or PATCH coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    var coupon = await Coupon.findOrFail(id)
    const trx = Database.beginTransaction()
    var can_use_for = {
      client: false,
      product: false
    }

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type',
        'recursive'
      ])
      coupon.merge(couponData)
      await coupon.save(trx)

      const { users, products } = request.only(['users', 'products'])
      const service = new Service(coupon, trx)

      if (users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      if (products && products.length > 0) {
        await service.syncUsers(users)
        can_use_for.product = true
      }

      if (can_use_for.products && can_use_for.client) {
        coupon.can_use_for = 'product_client'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'product'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()
      coupon = await transform
        .include('users,products')
        .item(coupon, Transformer)
      return response.send(coupon)
    } catch (error) {
      await trx.rollback()
      return response
        .status(400)
        .send({ message: 'Não foi possível atualizar este cupom' })
    }
  }

  /**
   * Delete a coupon with id.
   * DELETE coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const trx = await Database.beginTransaction()
    const coupon = await Coupon.findOrFail(id)
    try {
      //O array vazio no detach significa que irá remover todos
      await coupon.products().detach([], trx)
      await coupon.orders().detach([], trx)
      await coupon.users().detach([], trx)
      await coupon.delete(trx)

      await trx.commit()

      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(500).send({ message: 'Erro ao excluir o cupon' })
    }
  }
}

module.exports = CouponController
