import React from 'react';
import io from 'socket.io-client'

import {
  Entrance,
  Chat,
} from './screens'
import { makeService } from './service'

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
    service: null,
    socket: null,
    userID: null,
  }

  componentDidMount() {
    // socket :: Socket
    const socket = io(process.env.REACT_APP_ENDPOINT)
    const service = makeService(socket)

    this.setState({ socket, service })
  }

  // handleRegister :: string -> void
  handleRegister = userID => {
    this.setState({ userID })
  }

  render() {
    const { service, socket, userID } = this.state

    if (!socket) return null

    return (
      <div className="App" style={{ height: '100%' }}>
        {userID ? (
          <Chat
            service={service}
            socket={socket}
            userID={userID}
          />
        ) : (
            <Entrance
              service={service}
              socket={socket}
              onRegister={this.handleRegister}
            />
          )}
      </div>
    );
  }
}

export default App;
