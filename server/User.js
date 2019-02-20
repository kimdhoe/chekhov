// -------------------------------------
// State
// -------------------------------------

// userTable :: { [string]: string }
// state. Keeps track of registered users.
// interpretation.
//   - key - User ID.
//   - value - Socket ID.
let _userTable = {}

// -------------------------------------
// Functions
// -------------------------------------

// getAll :: -> string[]
// effect. returns an array of all user IDs.
function getAll() {
  return Object.keys(_userTable)
}

// getSocketID :: string -> string
// effect. returns a socket ID of a given user-id.
function getSocketID(userID) {
  const socketID = _userTable[userID]

  if (!socketID) {
    throw new Error('No socket ID for the user.')
  }

  return socketID
}

// register :: string * string -> void
// effect. Adds a given user-id and socket-id to _userTable.
function register(userID, socketID) {
  if (isRegistered(userID)) {
    throw new Error(`Someone already took the ID "${userID}".`)
  }

  _userTable[userID] = socketID
}

// deregister :: string -> void
// effect. Deletes a given user-id from _userTable.
function deregister(userID) {
  delete _userTable[userID]
}

// deregisterBySocketID :: string -> void
// effect. Given a socket ID, deletes a user ID from _userTable.
function deregisterBySocketID(socketID) {
  const keys = Object.keys(_userTable)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (_userTable[key] === socketID) {
      delete _userTable[key]
    }
  }
}


// isRegistered :: string -> boolean
// effect. Is a given user-id exist on _userTable?
function isRegistered(userID) {
  return !!_userTable[userID]
}

// count :: -> void
// effect. Returns the number of users registered.
function count() {
  return Object.keys(_userTable).length
}

// clear :: -> void
// effect. Empties _userTable.
function clear() {
  _userTable = {}
}

module.exports = {
  getAll,
  getSocketID,
  register,
  deregister,
  deregisterBySocketID,
  isRegistered,
  count,
  clear,
}