const express = require('express');
const app = express();
const port = 3001;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const NRP = require('node-redis-pubsub');

const nrp = new NRP({
    host: 'localhost',
    port: '6379',
});

app.get('/', (request, response) => response.sendFile(__dirname + '/index.html'));

nrp.on ('ps message', (message) => {
    console.log('Mensagem recebida', message);
    io.emit('new message', message);
});

io.on('connection', (socket) => {
    socket.on('new message', (message) => {
        // message
        nrp.emit('ps message', message);
    });
    console.log('Usuario logou nesse trem');
    socket.on('disconnect', () => {
        console.log('Usuario deslogou desse trem');
    });
});

http.listen(port, () => console.log('Esse trem ta rodando!'));