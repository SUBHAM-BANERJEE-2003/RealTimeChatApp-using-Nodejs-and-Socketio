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
const formatMessage = require('./utils/messages')
const { userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users')
const botName = "ChatCord Admin"

//Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room);
        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

        //Broadcast when a user connect
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //send users and room info to client
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            //send users and room info to client
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }


    });
})

app.use(router)

//listen for the input
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));