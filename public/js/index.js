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
    var li = jQuery('<li></li>')
    li.text(`${message.from}: ${message.text}`)

    jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault()
    socket.emit('send', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {

    })
})
