import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import 'normalize.css'

import App from './app'
import './index.css'
import { makeService } from './service'

const socket = io(process.env.REACT_APP_ENDPOINT)
const service = makeService(socket)

ReactDOM.render(
  <App socket={socket} service={service} />,
  document.getElementById('root')
)