const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const User = require('./User')

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
  console.log('=> A user has been connected.')

  socket.on('disconnect', () => {
    console.log('=> A user has been disconnected.')
  })

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
    fn({
      ok: true,
      rooms: [
        { id: 'a', title: 'Moon', color: '#3E93A7 ' },
        { id: 'b', title: 'Mercury', color: '#27479A' },
        { id: 'c', title: 'Mars', color: '#FAC167' },
        { id: 'd', title: 'Earth', color: '#EB7D9A' },
        { id: 'e', title: 'Pluto', color: '#1EA368' },
        { id: 'f', title: 'Uranus', color: '#9CA4BF' },
      ]
    })
  })

  socket.on('message', message => {
    console.log(message)
  })
})

server.listen(PORT, err => {
  if (err) {
    throw err
  }

  console.log(`Listening on port ${PORT}`)
})