'use strict'

const Product = use('App/Models/Product')
const Database = use('Database')
const Transformer = use('App/Transformers/Product/ProductTransformer')
/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, transform, pagination }) {
    const { title } = request.only(['title'])

    const query = Product.query()

    // Adiciona o where, caso seja solicitado via url params
    if (title) {
      query.where('name', 'LIKE', `%${title}%`)
    }

    const products = await query.paginate(pagination.page, pagination.perpage)
    return response.send(await transform.paginate(products, Transformer))
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const transaction = await Database.beginTransaction()
    try {
      let product = request.only(['name', 'description', 'price', 'image_id'])
      const { images } = request.only(['images'])
      product = await Product.create(product, transaction)
      await product.images().attach(images, null, transaction)
      await transaction.commit()
      return response
        .status(201)
        .send(await transform.item(product, Transformer))
    } catch (error) {
      await transaction.rollback()
      return response.status(error.status).send(error)
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: {id}, transform }) {
    const product = await Product.findOrFail(id)
    return response.send(product);
    
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: {id}, request, transform, response }) {
    const product = await Product.findOrFail(id);
    try {
      const {name, description,price,image_id} = request.all()
      product.merge({name,description,price,image_id});
      await product.save()
    } catch (error) {
      return response.status(400).send({message: "Não foi possível atualizar este produto"})
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: {id}, response }) {
    
    const product = await Product.findOrFail(params.id)
    try {
    
      await product.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(500).send({message: "Não foi possível remover este produto"})
    }
  }
}

module.exports = ProductController