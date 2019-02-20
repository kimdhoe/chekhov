const Room = require('./Room')

const ROOM_ID = 'pluto'
const USER_ID = 'abcde'

afterEach(() => {
  Room.ROOMS.forEach(x => {
    x.participants = []
  })
})

describe('Room', () => {
  test('finds a room with a given ID', () => {
    const room = Room.getRoomByID(ROOM_ID)
    expect(room.id).toBe(ROOM_ID)
  })

  test('adds a user to a room', () => {
    const nParticipants = Room.join(ROOM_ID, USER_ID)
    expect(nParticipants).toBe(1)
    const room = Room.getRoomByID(ROOM_ID)
    expect(room.participants.length).toBe(1)
  })

  test('removes a user from a room', () => {
    const roomID = ROOM_ID
    const userID = USER_ID
    Room.join(roomID, userID)
    const n = Room.leave(roomID, userID)
    expect(n).toBe(0)
  })
})