var expect = require('expect')
var {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
    it('should generate the correct message obj', () => {
        var from = "sender"
        var text = "sample message"
        var message = generateMessage(from, text)

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({
            from,
            text
        })
    })
})

describe('generateLocationMessage', () => {
    it('should generate the correct location obj', () => {
        var from = "sender"
        var lat = "12.352345"
        var lon = "52.425463"
        var message = generateLocationMessage(from, lat, lon)
        var url = (`https://www.google.com/maps?q=${lat},${lon}`)
        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({from, url})
    })
})
