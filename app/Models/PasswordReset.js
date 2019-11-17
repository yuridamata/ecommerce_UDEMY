'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const {str_random} = use('App/Helpers')
class PasswordReset extends Model {
    static boot(){
        super.boot();

        /**
         *  Hook para gerar o token com vencimento para 30 minutos
         * 
         */
        this.addHook('beforeCreate', async model => {
            //Instância do model atual, ou seja PasswordReset
            model.token = await str_random(25);
            const expires_at = new Date();
            now.setMinutes(now.getTime() + 30)
            model.expires_at = expires_at;
        })

    }

    //Formata os valores para o padrão do MYSQL
    static get dates(){
        return ['created_at', 'updated_at', 'expires_at'];
    }
}

module.exports = PasswordReset
