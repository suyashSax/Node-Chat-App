const expect = require('expect')

const {isRealString} = require('./validation')

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var res = isRealString(214)
        expect(res).toBe(false)
    });

    it('should reject empty string', () => {
        var res = isRealString('  ')
        expect(res).toBe(false)
    });

    it('should allow string with non-space characters', () => {
        var res = isRealString('Suyash')
        expect(res).toBe(true)
  })
})
