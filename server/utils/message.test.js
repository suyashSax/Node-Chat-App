var expect = require('expect')
var {generateMessage} = require('./message')

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
