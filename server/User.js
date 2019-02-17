// userTable :: { [string]: boolean }
// Keeps track of registered users.
// Interpretation.
//   - key - User ID.
//   - value - Is this ID being used?
const userTable = {}

function register(userID) {
  if (userTable[userID]) {
    throw new Error(`Someone already took the ID "${userID}".`)
  }

  userTable[userID] = true
}

module.exports = {
  register,
}