import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'

import * as styles from './index.module.css'
import Message from './message'
import Editor from './editor'
import Invite from './invite'
import ArrowBackIcon from '../../../components/arrow-back-icon'
import PlusIcon from '../../../components/plus-icon'

// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatRoomState is an object: { messages:        Message[]
//                               , image:           string?,
//                               , showUserList:    boolean
//                               }

// -------------------------------------
// Component
// -------------------------------------

class ChatRoom extends React.Component {
  static propTypes = {
    userID: PropTypes.string.isRequired,
    room: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
    onPressBack: PropTypes.func.isRequired,
  }

  scrollContainerRef = React.createRef()
  inputRef = React.createRef()

  opacity = new Animated.Value(0)

  // state :: ChatRoomState
  state = {
    messages: [],
    image: null,
    showUserList: false,
  }

  componentDidMount() {
    this._isMounted = true
    this.fadeIn()

    const { service, room, userID } = this.props

    service.installMessageHandler(message => {
      this._isMounted && this.setState(
        state => ({
          messages: [...state.messages, message],
        }),
        this.scrollToBottom,
      )
    })

    service.joinRoom(room.id, userID)
  }

  componentWillUnmount() {
    this._isMounted = false
    const { props } = this

    props.service.leaveRoom(props.room.id, props.userID)
  }

  // fadeIn :: -> void
  // Reveals screen with animation.
  fadeIn = () => {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 150,
    }).start()
  }

  // fadeOut :: -> void
  // Hides screen with animation and excutes fn.
  fadeOut = fn => {
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 150,
    }).start(fn)
  }

  // scrollToBottom :: boolean -> void
  scrollToBottom = (animated = true) => {
    // scrollNode :: HTMLElement
    const scrollNode = this.scrollContainerRef.current

    scrollNode.scrollTo({
      top: scrollNode.scrollHeight,
      behavior: animated ? 'smooth' : 'auto',
    })
  }

  hideInviteModal = () => {
    this.setState({ showUserList: false })
  }

  handleSubmit = (text, image) => {
    const { props } = this
    const message = {
      type: 'default',
      sender: props.userID,
      room: props.room.id,
      text,
      image,
    }
    this.setState(({ messages }) => ({
      messages: [...messages, message],
    }), () => {
      props.service.sendMessage(message)
      this.scrollToBottom()
    })
  }

  handleInvitePress = () => {
    this.setState({ showUserList: true })
  }

  renderHeader = () => (
    <div
      className={styles.headerContainer}
      style={{ backgroundColor: this.props.room.color }}
    >
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => this.fadeOut(this.props.onPressBack)}
        >
          <ArrowBackIcon />
        </button>

        <h2 className={styles.titleText}>{this.props.room.title}</h2>

        <button
          data-testid="plusButton"
          className={styles.inviteButton}
          onClick={this.handleInvitePress}
        >
          <PlusIcon />
        </button>
      </header>
    </div>
  )

  renderChat = () => (
    <div
      ref={this.scrollContainerRef}
      className={styles.messagesContainer}
    >
      <div className={styles.messagesWrapper}>
        {this.state.messages.map((message, i) => (
          <Message
            key={i}
            message={message}
            mine={message.sender === this.props.userID}
          />
        ))}
      </div>
    </div>
  )

  renderEditor = () => (
    <Editor onSubmit={this.handleSubmit} />
  )

  renderInviteModal = () => (
    <Invite
      show={this.state.showUserList}
      close={this.hideInviteModal}
      service={this.props.service}
      userID={this.props.userID}
      room={this.props.room}
    />
  )

  render() {
    return (
      <Animated.div
        className={styles.container}
        style={{ opacity: this.opacity }}
      >
        {this.renderHeader()}
        {this.renderChat()}
        {this.renderEditor()}
        {this.renderInviteModal()}
      </Animated.div>
    )
  }
}

export default ChatRoom