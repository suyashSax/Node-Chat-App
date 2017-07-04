var socket = io()

// Arrow funcs not fully compatible with mobile clients...

socket.on('connect', function () {
    console.log('Connected to Server')

    socket.emit('createMessage', {
        from : "Suyash",
        text: "yo, I'm the client"
    })
})

socket.on('disconnect', function () {
    console.log('Disconncted from Server')
})

// Client side listener

socket.on('newMessage', function (message) {
    console.log('newMessage', message)
})
