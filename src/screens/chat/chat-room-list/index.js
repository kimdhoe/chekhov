import React from 'react'
import PropTypes from 'prop-types'

import * as styles from './index.module.css'

// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatRoomListState is an object: { rooms: ChatRoom[]
//                                   , error: string
//                                   }

// A ChatRoom is an object: { id:    string
//                          , title: string
//                          }

// -------------------------------------
// Component
// -------------------------------------

class ChatRoomList extends React.Component {
  state = {
    rooms: [],
    error: '',
  }

  componentDidMount() {
    this.props.socket.emit(
      'list',
      // boolean * string * ChatRoom[] -> void
      ({ ok, message, rooms }) => {
        if (!ok) {
          this.setState({ error: message })
        } else {
          this.setState({ rooms })
        }
      }
    )
  }

  // handleRoomClick :: ChatRoom -> void
  handleRoomClick = room => {
    console.log(room)
  }

  renderHeader = () => (
    <header className={styles.header}>
      <h2 className={styles.h2}>
        Cosmic Chat System
      </h2>

      <p className={styles.headerText}>
        What do you want to chat about?
      </p>
    </header>
  )

  renderRooms = rooms => (
    <div className={styles.rooms}>
      {rooms.map(this.renderRoom)}
    </div>
  )

  renderRoom = room => (
    <button
      className={styles.room}
      style={{ backgroundColor: room.color }}
      key={room.id}
      onClick={() => this.handleRoomClick(room)}
    >
      {room.title}
    </button>
  )

  render() {
    const { rooms } = this.state

    return (
      <div className={styles.container}>
        {this.renderHeader()}
        {this.renderRooms(rooms)}
      </div>
    )
  }
}

export default ChatRoomList