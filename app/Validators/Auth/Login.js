'use strict'

class Login {
  get rules () {
    return {
      // validation rules
      email: 'required|email',
      password: 'required'
    }
  }

  get messages(){
    return{
      'email.required': 'O e-mail é obrigatório!',
      'email.email': 'O e-mail está em formato inválido!',      
      'password.required': 'Senha não informada!'
    }
  }
}

module.exports = Login
