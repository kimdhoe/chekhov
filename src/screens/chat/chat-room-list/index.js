import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'

import * as styles from './index.module.css'

const { stagger, parallel, timing, createAnimatedComponent, Value } = Animated
const AnimatedHeader = createAnimatedComponent('header')
const AnimatedButton = createAnimatedComponent('button')

// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatRoomListState is an object: { rooms:     ChatRoom[]
//                                   , error:     string
//                                   , isPending: boolean
//                                   }

// -------------------------------------
// Component
// -------------------------------------

class ChatRoomList extends React.Component {
  static propTypes = {
    socket: PropTypes.object,
    onPressRoom: PropTypes.func.isRequired,
  }

  // headerOpacity :: Aniamted.Value
  headerOpacity = new Value(0)
  // opacities :: Aniamted.Value[]
  opacities = []
  // translateYs :: Aniamted.Value[]
  translateYs = []

  // state :: ChatRoomListState
  state = {
    rooms: [],
    error: '',
    isPending: true,
  }

  async componentDidMount() {
    timing(this.headerOpacity, {
      toValue: 1,
      duration: 300,
    }).start()

    try {
      const { rooms } = await this.props.service.fetchRooms()

      rooms.forEach(room => {
        const opacity = new Value(0)
        this.opacities.push(opacity)
        this.translateYs.push(opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [15, 0],
        }))
      })

      this.setState({
        isPending: false,
        rooms,
      }, () => this.enter(rooms.length))
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  // enter :: -> void
  // Reveals chat-room buttons with animation.
  enter = () => {
    stagger(
      17,
      this.opacities.map(anim => timing(anim, {
        toValue: 1,
        duration: 200,
      })),
    ).start()
  }

  // exit :: -> void
  // Hides chat-room buttons with animation.
  exit = fn => {
    parallel([
      timing(this.headerOpacity, { toValue: 0, duration: 200 }),
      stagger(11, this.opacities.map(
        opacity => timing(opacity, { toValue: 0, duration: 200 })),
      ),
    ]).start(fn)
  }

  // handleRoomClick :: ChatRoom -> void
  handleRoomClick = room => {
    this.exit(() => this.props.onPressRoom(room))
  }

  renderHeader = () => (
    <AnimatedHeader
      className={styles.header}
      style={{ opacity: this.headerOpacity }}
    >
      <h2 className={styles.h2}>
        <span className={styles.greeting}>Hello, </span>
        {this.props.userID}
      </h2>

      <p className={styles.headerText}>
        What do you want to chat about?
      </p>
    </AnimatedHeader>
  )

  renderPlaceholder = () => (
    <div className={styles.rooms}>
      <div className={styles.room} style={{ backgroundColor: '#f8f9fa' }} />
      <div className={styles.room} style={{ backgroundColor: '#f8f9fa' }} />
      <div className={styles.room} style={{ backgroundColor: '#f8f9fa' }} />
    </div>
  )

  renderRooms = rooms => (
    <div className={styles.rooms}>
      {rooms.map(this.renderRoom)}
    </div>
  )

  renderRoom = (room, i) => (
    <AnimatedButton
      key={room.id}
      className={styles.room}
      style={{
        backgroundColor: room.color,
        opacity: this.opacities[i],
        transform: [{ translateY: this.translateYs[i] }],
      }}
      onClick={() => this.handleRoomClick(room)}
    >
      {room.title}
    </AnimatedButton>
  )

  render() {
    const { isPending, rooms } = this.state

    return (
      <div className={styles.container}>
        {this.renderHeader()}
        {isPending
          ? this.renderPlaceholder()
          : this.renderRooms(rooms)
        }
      </div>
    )
  }
}

export default ChatRoomList