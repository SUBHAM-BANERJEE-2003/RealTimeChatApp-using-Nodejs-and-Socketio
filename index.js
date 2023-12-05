const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const router = require('./router')
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {

    //Welcome current user
    socket.emit('message', "welcome to ChatCord");

    //Broadcast when a user connect
    socket.broadcast.emit('message', "A user has joined the chat");

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg)
    })
})

app.use(router)


server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));