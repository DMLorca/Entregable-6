const express = require('express');
const fs = require('fs');
const { defaultConfiguration } = require('express/lib/application');
const { Server: HttpServer } = require('http');       
const { Server: SocketServer } = require('socket.io');

let producto = [];
let messages = [];


const app = express();
app.use(express.static('public')); 

let modulo = require('./Contenedor.js');
let contenedor = new modulo.Contenedor('./public/productos.txt');

const httpServer = new HttpServer(app);             
const socketServer = new SocketServer(httpServer);   

socketServer.on('connection', (socket) => {

    const data = fs.readFileSync('./public/mensajes.txt');
    messages = JSON.parse(data);

    contenedor.getAll().then((result) => {
        producto = result;
        socket.emit('new_event', producto, messages);      
    });

    socket.on('nuevo_prod', (obj) => {
        
        async function ejecutarSaveShow(argObj) {
            await contenedor.save(argObj);
            const result = await contenedor.getAll();
            producto = result;
            socketServer.sockets.emit('new_event', producto, messages);
        }   
        ejecutarSaveShow(obj);
    });
    socket.on('new_message', (mensaje) => {             
        messages.push(mensaje);
        fs.promises.writeFile('./public/mensajes.txt', JSON.stringify(messages, null, 2));                           
        socketServer.sockets.emit('new_event', producto, messages); 
      }); 
});

httpServer.listen(8080, () => {
  console.log('Estoy escuchando en el puerto 8080');
});
