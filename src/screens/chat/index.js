import React from 'react'

import * as styles from './index.module.css'
import ChatRoomList from './chat-room-list'

class Chat extends React.Component {
  state = {
    chatRoomId: null,
  }

  componentDidMount() {
  }

  render() {
    const { socket } = this.props
    const { chatRoomId } = this.state

    return (
      <div className={styles.container}>
        {chatRoomId ? (
          null
        ) : (
          <ChatRoomList socket={socket} />
        )}
      </div>
    )
  }
}

export default Chat