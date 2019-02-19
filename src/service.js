function makeService(socket) {
  return {
    // fetchAllUsers :: -> Promise<string[]>
    fetchAllUsers() {
      return new Promise(resolve => {
        socket.emit('user list', resolve)
      })
    },

    invite(senderID, receiverID, room) {
      socket.emit('invitation', senderID, receiverID, room)
    }
  }
}

export {
  makeService,
}