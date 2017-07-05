const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New user connected')

    // no callback for server side event creation, pass data

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required')
        }

        socket.join(params.room)
        // socket.leave

        // target specific users in a room:

        // io.emit -> io.to(room name).emit
        // socket.broadcast.emit -> socket.broadcast.to(room name).emit
        // socket.emit -> only current user

        socket.emit('receive', generateMessage("Admin", "Welcome to the chat app"))
        socket.broadcast.to(params.room).emit('receive', generateMessage("Admin", `${params.name} joined`))
        callback()
    })

    socket.on('send', (message, callback) => {
        console.log("send", message)
        io.emit('receive', generateMessage(message.from, message.text))
        callback()
    })

    socket.on('sendLocation', (coords) => {
        io.emit('receiveLocation', generateLocationMessage('Admin', coords.lat, coords.lon))
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})

server.listen(port, () => {
    console.log(`Started server on ${port}`)
})
