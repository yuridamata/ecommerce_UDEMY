'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Pagination {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle (ctx, next) {

    if(ctx.request.method() === 'GET'){
      const page = parseInt(ctx.request.input('page'));
      const limit = parseInt(ctx.request.input('limit'));
      const perpage = ctx.request.input('perpage')

      ctx.pagination = {
        page,limit
      }

      if(perpage){
        ctx.pagination.limit = perpage;
      }

    }
    // call next to advance the request
    await next()

  }
}

module.exports = Pagination
