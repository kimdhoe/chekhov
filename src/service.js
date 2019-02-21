function makeService(socket) {
  return {
    // fetchAllUsers :: -> Promise<string[]>
    fetchAllUsers() {
      return new Promise(resolve => {
        socket.emit('user list', resolve)
      })
    },

    invite(senderID, receiverID, room, fn) {
      socket.emit('invitation', senderID, receiverID, room, fn)
    },

    register(userID, f) {
      socket.emit('register', userID, f) },
    // installReconnectionHandler :: string -> void
    // Re-registers user when socket reconnects.
    //   * This happens when server restarts.
    installReconnectionHandler(userID) {
      socket.on('connect', () => {
        socket.emit('register', userID, () => { })
      })
    },

    installInvitationHandler(f) {
      socket.on('invitation', f)
    },

    fetchRooms() {
      return new Promise((resolve, reject) => {
        socket.emit('list', ({ ok, message, rooms }) => {
          if (ok) {
            resolve({ rooms })
          } else {
            reject({ message })
          }
        })
      })
    },

    // installMessageHandler :: (Message -> void) -> void
    installMessageHandler(f) {
      socket.on('message', f)
    },

    // joinRoom :: string * string -> void
    joinRoom(roomID, userID) {
      // Re-join room when socket reconnects.
      //   * This happens when server restarts.
      socket.on('connect', () => {
        socket.emit('join', { roomID, userID })
      })
      socket.emit('join', { roomID, userID })
    },

    // leaveRoom :: string * string -> void
    leaveRoom(roomID, userID) {
      socket.emit('leave', { roomID, userID })
    },

    // sendMessage :: string -> void
    sendMessage(message) {
      socket.emit('message', message)
    },
  }
}

export {
  makeService,
}