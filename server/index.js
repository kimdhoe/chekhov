const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const User = require('./User')

const PORT = 3001

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const users = {}

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