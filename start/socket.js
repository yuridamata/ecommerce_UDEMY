'use strict'

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use('Ws')
//QUando o nome do topico e do canal são iguais, pode colocar somente o nome.
Ws.channel('notifications', 'NotificationController') // Ws.channel('<canal>:<topico>', 'NotificationController')
