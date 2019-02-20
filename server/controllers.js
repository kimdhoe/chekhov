const User = require('./User')
const Room = require('./Room')

function makeControllers(socket, io) {
  // handleDisconnect :: -> void
  function handleDisconnect() {
    // Emit leave event.
    const room = Room.getRoomForSocket(socket.id)
    const userID = User.getUserForSocket(socket.id)

    if (room) {
      const leave = {
        roomID: room.id,
        userID,
      }
      handleLeave(leave)
    }

    // Release the user ID occupied by the socket so that other people can use.
    User.deregisterBySocketID(socket.id)
  }

  // handleRegister :: string * (RegisterResponse -> void) -> void
  function handleRegister(userID, fn) {
    try {
      User.register(userID, socket.id)
      fn({ ok: true })
    } catch (err) {
      fn({ ok: false, message: err.message })
    }
  }

  // handleList :: (ListResponse -> void) -> void
  function handleList(fn) {
    fn({ ok: true, rooms: Room.ROOMS })
  }

  // handleJoin :: JoinRequest -> void
  function handleJoin(req) {
    socket.join(req.roomID)

    // room :: ChatRoom
    const room = Room.getRoomByID(req.roomID)
    // message :: Message
    const message = {
      type: 'announcement',
      text: `${req.userID} joined ${room.title}.`,
    }

    Room.setRoomForSocket(socket.id, room)
    io.in(room.id).emit('message', message)
  }

  // handleLeave :: LeaveRequest -> void
  function handleLeave(req) {
    socket.leave(req.roomID)

    // room :: ChatRom
    const room = Room.getRoomByID(req.roomID)
    // message :: Message
    const message = {
      type: 'announcement',
      text: `${req.userID} left ${room.title}.`,
    }

    Room.removeRoomForSocket(socket.id)
    io.in(req.roomID).emit('message', message)
  }

  // handleMessage :: Message -> void
  function handleMessage(message) {
    socket.to(message.room).emit('message', message)
  }

  // handleUserList :: (-> void) -> void
  function handleUserList(fn) {
    fn(User.getAll())
  }

  // handleInvitation :: string * string * ChatRoom * (-> void) -> void
  function handleInvitation(senderID, receiverID, room, fn) {
    io.to(User.getSocketID(receiverID)).emit('invitation', senderID, room)
    fn()
  }

  return {
    handleDisconnect,
    handleRegister,
    handleList,
    handleJoin,
    handleLeave,
    handleMessage,
    handleUserList,
    handleInvitation,
  }
}

module.exports = {
  makeControllers,
}