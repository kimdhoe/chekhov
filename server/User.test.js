const User = require('./User')

afterEach(() => {
  User.clear()
})

describe('User', () => {
  test('registers user', () => {
    const id = 'abc'
    User.register(id)
    expect(User.isRegistered(id)).toBe(true)
  })

  test('deregisters user', () => {
    const id = 'abc'
    User.register(id)
    User.deregister(id)
    expect(User.isRegistered(id)).toBe(false)
  })

  test('checks if user is registered', () => {
    const id = 'abc'
    User.register(id)
    expect(User.isRegistered(id)).toBe(true)
  })

  test('counts registered users', () => {
    User.register('a')
    User.register('b')
    User.register('c')
    expect(User.count()).toBe(3)
  })

  test('clears all users', () => {
    User.register('a')
    User.register('b')
    User.register('c')
    expect(User.count()).toBe(3)
    User.clear()
    expect(User.count()).toBe(0)
  })
})