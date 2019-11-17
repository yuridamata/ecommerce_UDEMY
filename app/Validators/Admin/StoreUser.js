'use strict'

class AdminStoreUser {
  get rules () {

    let userID = this.ctx.params.id;
    let rule = '';

    //Significa a atualização do usuário
    if(userID){
      rule = `unique:users,email,id,${userID}` // unique(tableName, [fieldName], [ignoreField], [ignoreValue])

    }else{
      rule = `unique:users,email|required ` // unique(tableName, [fieldName], [ignoreField], [ignoreValue])
    }

    return {
      // validation rules

    }
  }
}

module.exports = AdminStoreUser
