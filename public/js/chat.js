var socket = io()

// Arrow funcs not fully compatible with mobile clients...

function scrollToBottom(){
    // Selectors
    var messages = jQuery('#messages')
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function () {
    console.log('Connected to Server')
    var params = jQuery.deparam(window.location.search)
    socket.emit('join', params, function (err){
        if(err){
            alert(err)
            window.location.href = '/'
        }else{
            console.log("No error")
        }
    })
})

socket.on('disconnect', function () {
    console.log('Disconncted from Server')
})

socket.on('updateUsers', function (users) {
    console.log('Users:', users)
})

// Client side listener

socket.on('receive', function (message) {

    var template = jQuery('#message-template').html()
    var formattedTime = moment(message.createdAt).format('h:mm a')

    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })

    jQuery('#messages').append(html)
    scrollToBottom()
})

socket.on('receiveLocation', function (message){

    var template = jQuery('#loc-message-template').html()
    var formattedTime = moment(message.createdAt).format('h:mm a')

    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    })

    jQuery('#messages').append(html)
    scrollToBottom()
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
