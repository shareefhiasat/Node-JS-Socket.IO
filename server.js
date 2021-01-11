/**
 * I shareef, applied each step in this tutorial
 * https://www.youtube.com/watch?v=jD7FnbI76Hg
 */
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeavesChat, getRoomUsers } = require('./utils/users');

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCron Bot';

//Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        //Create a user
        const user = userJoin(socket.id, username, room);

        //joining message
        console.log('Joining to: ' + user.room + ' socket.id: ' + socket.id);

        //Join a user
        socket.join(user.room);

        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to chatcord!'));

        //Broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    //Listen for chatMessage.
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeavesChat(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            //Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server is running on ${PORT}`));