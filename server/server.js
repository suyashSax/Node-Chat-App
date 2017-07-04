const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('receive', generateMessage("Admin", "Welcome to the chat app"))

    socket.broadcast.emit('receive', generateMessage("Admin", "New user joined"))

    // no callback for server side event creation, pass data

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
