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
const PORT = 3001

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

  socket.on('register', (userID, fn) => {
    try {
      User.register(userID)

      // response :: RegisterResponse
      const response = { ok: true }

      fn(response)
    } catch (err) {
      // response :: RegisterResponse
      const response = { ok: false, message: err.message }

      fn(response)
    }
  })

  socket.on('list', fn => {
    // response :: ListResponse
    const response = { ok: true, rooms: Room.ROOMS }

    fn(response)
  })

  socket.on(
    'join',
    // req :: JoinRequest
    req => {
      socket.join(req.roomID)

      // room :: ChatRoom
      const room = Room.getRoomByID(req.roomID)

      // message :: Message
      const message = {
        type: 'announcement',
        text: `${req.userID} joined ${room.title}.`,
      }

      io.to(req.roomID).emit('message', message)
    },
  )

  socket.on(
    'leave',
    // req :: LeaveRequest
    req => {
      socket.leave(req.roomID)

      // room :: ChatRoom
      const room = Room.getRoomByID(req.roomID)

      // message :: Message
      const message = {
        type: 'announcement',
        text: `${req.userID} left ${room.title}.`,
      }

      io.to(req.roomID).emit('message', message)
    }
  )

  socket.on(
    'message',
    // message :: Message
    message => {
      socket.broadcast.to(message.room).emit('message', message)
    }
  )
})

server.listen(PORT, err => {
  if (err) {
    throw err
  }

  console.log(`Listening on port ${PORT}`)
})