const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { makeControllers } = require('./controllers')

// -------------------------------------
// Constants
// -------------------------------------

// PORT :: number
//   * process.env.PORT is for Heroku deployment, not for development.
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
  const controllers = makeControllers(socket, io)

  socket.on('disconnect', controllers.handleDisconnect)
  socket.on('register', controllers.handleRegister)
  socket.on('list', controllers.handleList)
  socket.on('join', controllers.handleJoin)
  socket.on('leave', controllers.handleLeave)
  socket.on('message', controllers.handleMessage)
  socket.on('user list', controllers.handleUserList)
  socket.on('invitation', controllers.handleInvitation)
})

server.listen(PORT, err => {
  if (err) {
    throw err
  }

  console.log(`Listening on port ${PORT}`)
})