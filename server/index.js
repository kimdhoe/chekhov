// TODO:
//   * socket controller
//   * user service
//   * room service

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
  socket.on('disconnect', () => {})

  socket.on('register', (userID, fn) => {
    try {
      User.register(userID)
      fn({ ok: true })
    } catch (err) {
      fn({
        ok: false,
        message: err.message,
      })
    }
  })

  socket.on('list', fn => {
    fn({ ok: true, rooms: Room.ROOMS })
  })

  socket.on('join', ({ room, userID }) => {
    socket.join(room.id)
    io.to(room.id).emit('message', {
      type: 'announcement',
      text: `${userID} joined ${room.title}.`,
    })
  })

  socket.on('leave', ({ room, userID }) => {
    socket.leave(room.id)
    io.to(room.id).emit('message', {
      type: 'announcement',
      text: `${userID} left ${room.title}.`,
    })
  })

  socket.on('message', message => {
    socket.broadcast.to(message.room).emit('message', message)
  })
})

server.listen(PORT, err => {
  if (err) {
    throw err
  }

  console.log(`Listening on port ${PORT}`)
})