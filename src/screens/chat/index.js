import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'

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
  static propTypes = {
    service: PropTypes.object.isRequired,
  }

  opacity = new Animated.Value(1)
  invitationOpacity = new Animated.Value(0)
  invitationTranslateY = this.invitationOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  })

  // state :: ChatState
  state = {
    room: null,
    invitation: null,
  }

  componentDidMount() {
    const { service, userID } = this.props

    service.installReconnectionHandler(userID)
    service.installInvitationHandler((senderID, room) => {
      this.showInvitation(senderID, room)
    })
  }

  showInvitation = (senderID, room) => {
    this.setState({ invitation: { senderID, room } }, () => {
      Animated.timing(this.invitationOpacity, {
        toValue: 1,
        duration: 200,
      }).start()
    })
  }

  // clearInvitation :: function? -> void
  clearInvitation = fn => {
    Animated.timing(this.invitationOpacity, {
      toValue: 0,
      duration: 150,
    }).start(() => {
      this.setState({ invitation: null }, () => fn && fn())
    })
  }

  // joinRoom :: Room -> void
  joinRoom = room => {
    this.setState({ room })
  }

  // goBack :: -> void
  goBack = () => {
    this.setState({ room: null })
  }

  // acceptInvitation :: -> void
  acceptInvitation = () => {
    const { room } = this.state.invitation

    // Pass if already in the room.
    if (this.state.room && room.id === this.state.room.id) {
      this.clearInvitation()
      return
    }

    this.clearInvitation(() => {
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 300,
      }).start(() => {
        // TODO:
        //   이미 채팅방 스크린에 있는 경우, mount를 건너뛰기 때문에 socket 이벤트 설정 등의 코드가
        //   실행되지 않는다. 임시방편으로 강제로 unmount시킨 후 다시 방으로 입장시키도록 했다.
        //   채팅방 목록 스크린과 채팅방 스크린 둘 중 하나가 표시되는 시스템이기 떄문에 초대를 수락할 때
        //   마다 리스트 스크린을 렌더링하는 부작용이 있다.
        this.setState({ room: null })
        this.setState({ room })
        Animated.timing(this.opacity, {
          toValue: 1,
          duration: 300,
        }).start()
      })
    })
  }

  render() {
    const { socket, userID } = this.props
    const { room, invitation } = this.state

    return (
      <Animated.div
        className={styles.container}
        style={{ opacity: this.opacity }}
      >
        {room
          ? (
            <ChatRoom
              service={this.props.service}
              socket={socket}
              userID={userID}
              room={room}
              onPressBack={this.goBack}
            />
          )
          : (
            <ChatRoomList
              socket={socket}
              userID={userID}
              onPressRoom={this.joinRoom}
            />
          )
        }

        {invitation && (
          <Invitation
            opacity={this.invitationOpacity}
            translateY={this.invitationTranslateY}
            invitation={invitation}
            onYes={this.acceptInvitation}
            onNo={this.clearInvitation}
          />
        )}
      </Animated.div>
    )
  }
}

export default Chat