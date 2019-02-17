import React from 'react'

import * as styles from './index.module.css'
import ChatRoomList from './chat-room-list'
import ChatRoom from './chat-room'

// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatState is an object: { room: ChatRoom? }

// -------------------------------------
// Component
// -------------------------------------

class Chat extends React.Component {
  // state :: ChatState
  state = {
    room: null,
  }

  // handleRoomPress :: Room -> void
  handleRoomPress = room => {
    this.setState({ room })
  }

  handleBackPress = () => {
    this.setState({ room: null })
  }

  render() {
    const { socket, userID } = this.props
    const { room } = this.state

    return (
      <div className={styles.container}>
        {room
          ? (
            <ChatRoom
              socket={socket}
              userID={userID}
              room={room}
              onPressBack={this.handleBackPress}
            />
          )
          : (
            <ChatRoomList
              socket={socket}
              onPressRoom={this.handleRoomPress}
            />
          )
        }
      </div>
    )
  }
}

export default Chat