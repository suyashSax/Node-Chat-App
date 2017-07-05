const expect = require('expect')
const {Users} = require('./users')

describe('Users', () => {
    var users

    beforeEach(() => {
            users = new Users()
            users.users = [{
                    id: '1',
                    name: 'Abe',
                    room: '1'
            }, {
                    id: '2',
                    name: 'Ben',
                    room: '2'
            }, {
                    id: '3',
                    name: 'Carey',
                    room: '1'
            }]
      })

    it('should add new user', () => {
        var users = new Users()
        var user = {
            id: '5',
            name: 'Suyash',
            room: 'The Office Fans'
        }
        var resUser = users.addUser(user.id, user.name, user.room)
        expect(users.users).toEqual([user])
    })

    it('should return user names for room 1', () => {
        var userList = users.getUserList('1')
        expect(userList).toEqual(['Abe', 'Carey'])
    })

    it('should return user names for room 2', () => {
        var userList = users.getUserList('2')
        expect(userList).toEqual(['Ben'])
    })

    it('should remove a user that exists', () => {
        var userId = '1'
        var user = users.removeUser(userId)

        expect(user.id).toBe(userId)
        expect(users.users.length).toBe(2)
    })

    it('should not remove user that does not exist', () => {
        var userId = '100'
        var user = users.removeUser(userId)
        expect(user).toNotExist() // undefined
        expect(users.users.length).toBe(3)
    })

    it('should find user by id', () => {
        var userId = '2'
        var user = users.getUser(userId)
        expect(user.id).toBe(userId)
    })

    it('should not find user', () => {
        var userId = '99'
        var user = users.getUser(userId)
        expect(user).toNotExist()
    })

})
