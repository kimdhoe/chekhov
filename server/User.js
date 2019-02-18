// -------------------------------------
// State
// -------------------------------------

// userTable :: { [string]: boolean }
// state. Keeps track of registered users.
// interpretation.
//   - key - User ID.
//   - value - Is this ID being used?
let _userTable = {}

// -------------------------------------
// Functions
// -------------------------------------

// getAll :: -> string[]
// effect. returns an array of all user IDs.
function getAll() {
  return Object.keys(_userTable)
}

// register :: string -> void
// effect. Adds a give user-id to _userTable.
function register(userID) {
  if (isRegistered(userID)) {
    throw new Error(`Someone already took the ID "${userID}".`)
  }

  _userTable[userID] = true
}

// deregister :: string -> void
// effect. Deletes a given user-id from _userTable.
function deregister(userID) {
  delete _userTable[userID]
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
  register,
  deregister,
  isRegistered,
  count,
  clear,
}