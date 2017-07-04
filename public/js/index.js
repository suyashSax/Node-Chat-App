var socket = io()

// Arrow funcs not fully compatible with mobile clients...

socket.on('connect', function () {
    console.log('Connected to Server')
})

socket.on('disconnect', function () {
    console.log('Disconncted from Server')
})

// Client side listener

socket.on('receive', function (message) {
    console.log('receive', message)
})
