import React from 'react';
import io from 'socket.io-client'

import {
  Entrance,
  Chat,
} from './screens'

// -------------------------------------
// Constants
// -------------------------------------

const ENDPOINT = 'http://localhost:3001'

// -------------------------------------
// Data Definitions
// -------------------------------------

// An AppState is an object: { socket?: Socket
//                           , userID?  string
//                           }
//   * userID - A unique identifier of a user
//   * socket - socket.io-cilent Socket

// -------------------------------------
// Component
// -------------------------------------

class App extends React.Component {
  // state :: AppState
  state = {
    socket: null,
    userID: null,
  }

  componentDidMount () {
    const socket = io(ENDPOINT)

    this.setState({ socket })
  }

  handleRegister = userID => {
    this.setState({ userID })
  }

  render () {
    const { socket, userID } = this.state

    if (!socket) return null

    return (
      <div className="App" style={{ height: '100%' }}>
        {userID ? (
          <Chat />
        ) : (
          <Entrance
            socket={socket}
            onRegister={this.handleRegister}
          />
        )}
      </div>
    );
  }
}

export default App;
