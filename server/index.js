// TODO:
//   * socket controller

const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const User = require('./User')
const Room = require('./Room')

// -------------------------------------
// Constants
// -------------------------------------

// PORT :: number
const PORT = process.env.PORT || 3001

// -------------------------------------
// Main
// -------------------------------------

// app :: Express
const app = express()
// server :: Server
const server = http.createServer(app)
// io :: SocketIO.Server
const io = socketIO(server)

io.on('connection', socket => {
  socket.on('disconnect', () => { })

  socket.on(
    'register',
    // string * (RegisterResponse -> void) -> void
    (userID, fn) => {
      try {
        User.register(userID, socket.id)
        fn({ ok: true })
      } catch (err) {
        fn({ ok: false, message: err.message })
      }
    }
  )

  socket.on(
    'list',
    // (ListResponse -> void) -> void
    fn => fn({ ok: true, rooms: Room.ROOMS })
  )

  socket.on(
    'join',
    // JoinRequest -> void
    req => {
      socket.join(req.roomID)

      // room :: ChatRoom
      const room = Room.getRoomByID(req.roomID)
      // message :: Message
      const message = {
        type: 'announcement',
        text: `${req.userID} joined ${room.title}.`,
      }

      io.in(room.id).emit('message', message)
    },
  )

  socket.on(
    'leave',
    // LeaveRequest -> void
    req => {
      socket.leave(req.roomID)

      // room :: ChatRom
      const room = Room.getRoomByID(req.roomID)
      // message :: Message
      const message = {
        type: 'announcement',
        text: `${req.userID} left ${room.title}.`,
      }

      io.in(req.roomID).emit('message', message)
    }
  )

  socket.on(
    'message',
    // Message -> void
    message => {
      socket.to(message.room).emit('message', message)
    },
  )

  socket.on(
    'user list',
    fn => {
      fn(User.getAll())
    }
  )

  socket.on(
    'invitation',
    // string * string * ChatRoom -> void
    (senderID, receiverID, room, fn) => {
      io.to(User.getSocketID(receiverID)).emit('invitation', senderID, room)
      fn()
    },
  )
})

server.listen(PORT, err => {
  if (err) {
    throw err
  }

  console.log(`Listening on port ${PORT}`)
})