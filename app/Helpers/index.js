'use strict'

const crypto = use('crypto')

const Helpers = use('Helpers')

/**
 * 
 * Generate random string
 * 
 *  @param {int} length Tamanho da string desejada
 * 
 *  @return {string} String randomica do tamanho length
 */

const str_random = async (length = 40) => {
    let string = ''
    let len = string.length

    if (len < length) {
        let size = length - len
        let bytes = await crypto.randomBytes(size)
        let buffer = Buffer.from(bytes)

        string += buffer
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substr(0, size)
    }
    return string
}

/**
 *   Move um único arquivo para o caminho especificado. Se não especificado, o caminho Pulic/uploads será utilizado
 *  
 *  @param {FileJar} file o arquivo a ser gerenciado
 *  @param {string} path Caminho para onde o arquivo será movido
 * 
 *  @return { FileJar}
 */

const manage_single_upload = async (file,path = null) => {
    path = path ? path : Helpers.publicPath('uploads');
    // gera um nome aleatório
    const random_name = await str_random(30);
    let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`;

    //renomeia o arquivo e o move para o path
    await file.move( path, {
            name: filename,
    })

    return file;

}

/**
 *   Move múltiplos arquivo para o caminho especificado. Se não especificado, o caminho Pulic/uploads será utilizado
 *  
 *  @param {FileJar} file o arquivo a ser gerenciado
 *  @param {string} path Caminho para onde o arquivo será movido
 * 
 *  @return { Object }
 */


 const manage_multiple_uploads = async (fileJar, path = null) => {
    path = path ? path : Helpers.publicPath('uploads');
    let successes = [];
    let erros = [];


    await Promise.all(fileJar.files.map(async file => {
        let random_name = await str_random(30);
        let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`;

        //renomeia o arquivo e o move para o path
        await file.move( path, {
                name: filename,
        })

        //Verifica se o arquivo foi movido
        if(file.moved()){
            successes.push(file)
        }else{
            errors.push(file)
        }
    }))

   


 }

module.exports = {
    str_random,
    manage_multiple_uploads,
    manage_single_upload
}