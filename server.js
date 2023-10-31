const express = require('express');
const app = express();

const port = 4000;

const http = require('http')
const server = http.createServer(app);

const io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));

io.sockets.on('error', e => console.log(e))

io.sockets.on('connection', socket => {
    socket.on('broadcaster', () => {
        broadcaster = socket.id;
        socket.broadcaster.emit('broadcaster')
    })
    socket.on('watcher', () => {
        socket.io(broadcaster).emit('watcher', socket.id)
    });
    socket.on('offer', (id, message) => {
        socket.io(id).emit('offer', socket.id, message)
    });
    socket.on('answer', (id, message) => {
        socket.io(id).emit('answer', socket.id, message)
    });
    socket.on('candidate', (id, message) => {
        socket.io(id).emit('candidate', socket.id, message)
    });
    socket.on('disconnect', () => {
        socket.io(broadcaster).emit('disconnectPeer', socket.id)
    });
})

server.listen(port, () => console.log(`server is running on: ${port}`))