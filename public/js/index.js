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
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var li = jQuery('<li></li>')
    li.text(`${message.from} ${formattedTime}: ${message.text}`)

    jQuery('#messages').append(li)
})

socket.on('receiveLocation', function (message){
    var li = jQuery('<li></li>')
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var a = jQuery('<a target="_blank">My current location</a>')
    li.text(`${message.from} ${formattedTime}: `)
    a.attr('href', message.url)
    li.append(a)
    jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault()
    var messageBox = jQuery('[name=message]')

    // var length = messageBox.val().length
    // console.log(length)
    // if (length == 0){
    //     messageBox.attr["disabled", "disabled"]
    // }

    socket.emit('send', {
        from: 'User',
        text: messageBox.val()
    }, function () {
        messageBox.val('')
    })
})

var locationButton = jQuery('#send-location')
locationButton.on('click', function (){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser')
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...')

    navigator.geolocation.getCurrentPosition(function (position){
        locationButton.removeAttr('disabled').text('Send Location')
        var coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }
        console.log(coords)
        socket.emit('sendLocation', coords)
    }, function (){
        locationButton.removeAttr('disabled').text('Send Location')
        alert('Unable to fetch location')
    })
})
