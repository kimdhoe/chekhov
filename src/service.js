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
      socket.emit('register', userID, f)
    },

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
    }
  }
}

export {
  makeService,
}