import React from 'react';
import io from 'socket.io-client'

import {
  Entrance,
  Chat,
} from './screens'

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

  componentDidMount() {
    // socket :: Socket
    const socket = io(process.env.REACT_APP_ENDPOINT)

    this.setState({ socket })
  }

  // handleRegister :: string -> void
  handleRegister = userID => {
    this.setState({ userID })
  }

  render() {
    const { socket, userID } = this.state

    if (!socket) return null

    return (
      <div className="App" style={{ height: '100%' }}>
        {userID ? (
          <Chat
            socket={socket}
            userID={userID}
          />
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
