// Importación de módulos y configuración inicial
const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').Server(app);
const PORT = 4000;
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
const fs = require('fs');

// Lectura del archivo JSON de mensajes
const rawData = fs.readFileSync('messages.json');
const messagesData = JSON.parse(rawData);

// Configuración de CORS
app.use(cors());

let users = [];

// Manejo de conexiones de Socket.IO
socketIO.on('connection', (socket) => {
    // Evento para recibir y guardar nuevos mensajes
    socket.on("message", data => {
        messagesData["messages"].push(data);
        const stringData = JSON.stringify(messagesData, null, 2);
        // Escribir los mensajes actualizados en el archivo JSON
        fs.writeFile("messages.json", stringData, (err)=> {
            console.error(err);
        });
        // Emitir el mensaje a todos los clientes conectados
        socketIO.emit("messageResponse", data);
    });

    // Evento de escritura para notificar a otros usuarios
    socket.on("typing", data => (
        socket.broadcast.emit("typingResponse", data)
    ));

    // Evento para registrar un nuevo usuario
    socket.on("newUser", data => {
        users.push(data);
        // Emitir la lista actualizada de usuarios a todos los clientes
        socketIO.emit("newUserResponse", users);
    });

    // Manejo de desconexiones de usuarios
    socket.on('disconnect', () => {
        // Filtrar y actualizar la lista de usuarios al desconectar
        users = users.filter(user => user.socketID !== socket.id);
        // Emitir la lista actualizada de usuarios a todos los clientes
        socketIO.emit("newUserResponse", users);
        socket.disconnect();
    });
});

// Ruta para obtener los datos de mensajes
app.get('/api', (req, res) => {
    res.json(messagesData);
});

// Iniciar el servidor en el puerto especificado
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});