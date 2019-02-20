import React from 'react';
import PropTypes from 'prop-types'

import {
  Entrance,
  Chat,
} from './screens'
import * as styles from './app.module.css'

// -------------------------------------
// Data Definitions
// -------------------------------------

// An AppState is an object: { userID?  string }

// -------------------------------------
// Component
// -------------------------------------

class App extends React.Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
  }

  // state :: AppState
  state = {
    userID: null,
  }

  // handleRegister :: string -> void
  handleRegister = userID => {
    this.setState({ userID })
  }

  render() {
    const { service, socket } = this.props
    const { userID } = this.state

    return (
      <div className={styles.container}>
        {userID
          ? (
            <Chat
              service={service}
              socket={socket}
              userID={userID}
            />
          )
          : (
            <Entrance
              service={service}
              onRegister={this.handleRegister}
            />
          )
        }
      </div>
    );
  }
}

export default App;
