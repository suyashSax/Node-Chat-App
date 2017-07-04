const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('receive', {
        from: "Admin",
        text: "Welcome to the app",
        createdAt: new Date().getTime()
    })

    socket.broadcast.emit('receive', {
        from: "Admin",
        text: "New user has joined",
        createdAt: new Date().getTime()
    })

    // no callback for server side event creation, pass data

    socket.on('send', (message) => {
        console.log("send", message)

        io.emit('receive', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })

        // broadcast: emit to everyone but yourself

        // socket.broadcast.emit('receive', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})

server.listen(port, () => {
    console.log(`Started server on ${port}`)
})
