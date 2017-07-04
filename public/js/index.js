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

socket.on('receiveLocation', function (message){
    var li = jQuery('<li></li>')
    var a = jQuery('<a target="_blank">My current location</a>')
    li.text(`${message.from}: `)
    a.attr('href', message.url)
    li.append(a)
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

var locationButton = jQuery('#send-location')
locationButton.on('click', function (){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition(function (position){
        var coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }
        console.log(coords)
        socket.emit('sendLocation', coords)
    }, function (){
        alert('Unable to fetch location')
    })
})
