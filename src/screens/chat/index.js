import React from 'react'

import * as styles from './index.module.css'
import ChatRoomList from './chat-room-list'
import ChatRoom from './chat-room'
import Invitation from './invitation'

// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatState is an object: { room: ChatRoom? }

// An Invitation is an object: { senderID: string,
//                             , room:     Room,
//                             }

// -------------------------------------
// Component
// -------------------------------------

class Chat extends React.Component {
  // state :: ChatState
  state = {
    room: null,
    invitation: null,
  }

  componentDidMount() {
    const { socket, userID } = this.props

    socket.on('invitation', (senderID, room) => {
      console.log(`${senderID} invited you to ${room.title}.`)

      this.setState({
        invitation: { senderID, room }
      })
    })

    // Re-registers user when socket reconnects.
    //   * This happens when server restarts.
    socket.on('connect', () => {
      socket.emit('register', userID, () => {})
    })
  }

  clearInvitation = () => {
    this.setState({ invitation: null })
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
    const { room, invitation } = this.state

    return (
      <div className={styles.container}>
        {room
          ? (
            <ChatRoom
              service={this.props.service}
              socket={socket}
              userID={userID}
              room={room}
              onPressBack={this.handleBackPress}
            />
          )
          : (
            <ChatRoomList
              socket={socket}
              userID={userID}
              onPressRoom={this.handleRoomPress}
            />
          )
        }

        {invitation && (
          <Invitation
            invitation={invitation}
          />
        )}
      </div>
    )
  }
}

export default Chat