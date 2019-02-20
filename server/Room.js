// -------------------------------------
// Constants
// -------------------------------------

// ROOMS :: ChatRoom[]
const ROOMS = [
  { id: 'moon',    title: 'Moon',    color: '#3E93A7', participants: [] },
  { id: 'mercury', title: 'Mercury', color: '#27479A', participants: [] },
  { id: 'mars',    title: 'Mars',    color: '#FAC167', participants: [] },
  { id: 'earth',   title: 'Earth',   color: '#EB7D9A', participants: [] },
  { id: 'pluto',   title: 'Pluto',   color: '#1EA368', participants: [] },
  { id: 'uranus',  title: 'Uranus',  color: '#9CA4BF', participants: [] },
]

// -------------------------------------
// State
// -------------------------------------

// _chatRooms :: { [string]: ChatRoom }
// state. Keeps track of chat-room status.
const _chatRooms = ROOMS.reduce(
  (acc, room) => ({ ...acc, [room.id]: room }),
  {},
)

// _socketIDToRooms :: { [string]: ChatRoom }
// state. Keeps track of socketID-room map.
const _socketIDToRooms = {}

// -------------------------------------
// Functions
// -------------------------------------

// getRoomByID :: string -> ChatRoom
// Finds a room with a given id.
const getRoomByID = id => _chatRooms[id]

// join :: string * string -> number
// effect. Adds a given userID to a room with roomID.
const join = (roomID, userID) => {
  const room = getRoomByID(roomID)
  const { participants } = room

  participants.push(userID)

  return participants.length
}

// leave :: string * string -> number
// Removes a given userID from a room with roomID, and returns the number of participants.
// effect. Mutates chatRooms.
const leave = (roomID, userID) => {
  const room = getRoomByID(roomID)
  const { participants } = room
  let index = -1

  for (let i = 0; i < participants.length; i++) {
    if (participants[i] === userID) {
      index = i
      break
    }
  }

  participants.splice(index, 1)

  return participants.length
}

const setRoomForSocket = (socketID, room) => {
  _socketIDToRooms[socketID] = room
}

const getRoomForSocket = socketID => _socketIDToRooms[socketID]

const removeRoomForSocket = socketID => {
  delete _socketIDToRooms[socketID]
}

module.exports = {
  ROOMS,
  getRoomByID,
  setRoomForSocket,
  getRoomForSocket,
  removeRoomForSocket,
  join,
  leave,
}