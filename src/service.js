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
    }
  }
}

export {
  makeService,
}