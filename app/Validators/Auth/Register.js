'use strict'

class AuthRegister {
  get rules () {
    return {
      // validation rules
      name: 'required',
      surname: 'required',
      email: 'required|email|unique:users,email', // unique:<nome_tabela>,<coluna>
      password: 'required|confirmed' //Obriga a ter um campo <nome_do_campo>_confirmed

    }
  }

  get messages(){
    return{
      'name.required': 'O nome é obrigatório!',
      'surname.required': 'O sobrenome é obrigatório!',
      'email.required': 'E-mail não informado',
      'email.email': 'E-mail inválido!',
      'email.unique': 'Este e-mail já existe!',
      'password.required': 'A senha é obrigatória!',
      'password.confirmed': 'As senhas não são iguais!'
    }
  }
}

module.exports = AuthRegister
