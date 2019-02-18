// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatRoom is an object: { id:           string
//                          , title:        string
//                          , color:        string
//                          , participants: string[]
//                          }
//   * participants - IDs of current participants.

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

// chatRooms :: { [string]: object}
// state. Keeps track of chat-room status.
const chatRooms = ROOMS.reduce(
  (acc, room) => ({ ...acc, [room.id]: room }),
  {},
)

// -------------------------------------
// Functions
// -------------------------------------

// getRoomByID :: string -> ChatRoom
const getRoomByID = id => chatRooms[id]

// join :: string * string -> number
const join = (roomID, userID) => {
  const room = getRoomByID(roomID)
  const { participants } = room

  participants.push(userID)

  return participants.length
}

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

module.exports = {
  ROOMS,
  join,
  leave,
}