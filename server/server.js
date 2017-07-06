const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {Users} = require('./utils/users')
const {isRealString} = require('./utils/validation')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

app.use(express.static(publicPath))

// target specific users in a room:

// io.emit -> io.to(room name).emit
// socket.broadcast.emit -> socket.broadcast.to(room name).emit
// socket.emit -> only current user

io.on('connection', (socket) => {
    console.log('New user connected')

    // no callback for server side event creation, pass data

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required')
        }

        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUsers', users.getUserList(params.room))
        socket.emit('receive', generateMessage("Admin", "Welcome to the chat app"))
        socket.broadcast.to(params.room).emit('receive', generateMessage("Admin", `${params.name} has joined`))
        callback()
    })

    socket.on('send', (message, callback) => {
        var user = users.getUser(socket.id)
        if(user && isRealString(message.text)){
            io.to(user.room).emit('receive', generateMessage(user.name, message.text))
        }
        callback()
    })

    socket.on('sendLocation', (coords) => {
        var user = users.getUser(socket.id)
        if(user){
            io.to(user.room).emit('receiveLocation', generateLocationMessage(user.name, coords.lat, coords.lon))
        }
    })

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id)

        if (user){
            io.to(user.room).emit('updateUsers', users.getUserList(user.room))
            io.to(user.room).emit('receive', generateMessage('Admin', `${user.name} has left.`))
        }
        console.log('User was disconnected')
    })
})

server.listen(port, () => {
    console.log(`Started server on ${port}`)
})
