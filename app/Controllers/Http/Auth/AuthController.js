'use strict'
/** @typedef {import('@adonisjs/auth/index')} Auth */

const Database = use('Database');
const User = use('App/Models/User');
const Role = use('Role');
const Ws = use('Ws')

class AuthController {

    async register({request, response}){
        const trx = await Database.beginTransaction();
        try {
            const {name,surname,email,password} = request.all();
            const user = await User.create({name,surname,email,password}, trx); // O segundo parâmetro é a transação senod executada
            const userRole = await Role.findBy('slug', 'client');
            await user.roles().attach([userRole.id], null, trx); // O segundo parâmetro é uma callback. Como não será usado, passa-se null
            await trx.commit();
            const topic = Ws.getChannel('notifications').topic('notifications'); // Caso não tenha ninguém ouvindo, o retorna nulo
            if(topic){
                topic.broadcast('new:user');
            }


            return response.status(201).send({data:user});
        } catch (error) {
            await trx.rollback();
            return response.status(400).send({message: 'Erro ao realizar cadastro'});
        }

    }
  /**
   * Login in the app
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
    async login({request, response, auth}){
        const {email,password} = request.all()
        let data = await auth.withRefreshToken().attempt(email,password);
        return response.send({data});
    }

    async refresh({request,response,auth}){
        let refresh_token = request.input('refresh_token');
        if(!refresh_token){
            refresh_token = request.header('refresh_token')
        }

        const user = await auth.newRefreshToken().generateForRefreshToken('refresh_token');

        return response.send({data: user});
    }

    async logout({request, response, auth}){
        let refresh_token = request.input('refresh_token');
        if(!refresh_token){
            refresh_token = request.header('refresh_token')
        }

        await auth.authenticator('jwt').revokeTokens([refresh_token], true)
        return response.status(204).send({});
    }

    async forgot({request, response, auth}){
        
    }

    async remember({request, response, auth}){
        
    }

}

module.exports = AuthController
