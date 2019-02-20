import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'

import * as styles from './index.module.css'
import Message from './message'
import Editor from './editor'
import Invite from './invite'
import ArrowBackIcon from '../../../components/arrow-back-icon'
import PlusIcon from '../../../components/plus-icon'
import ImageIcon from '../../../components/image-icon'
import SendIcon from '../../../components/send-icon'

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
    socket: PropTypes.object.isRequired,
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

    const { socket, room, userID } = this.props

    socket.on('message', message => {
      this._isMounted && this.setState(
        state => ({ messages: [...state.messages, message] }),
        this.scrollToBottom,
      )
    })

    // join :: JoinRequest
    const join = {
      roomID: room.id,
      userID,
    }

    // Re-join room when socket reconnects.
    //   * This happens when server restarts.
    socket.on('connect', () => {
      socket.emit('join', join)
    })

    socket.emit('join', join)
  }

  componentWillUnmount() {
    this._isMounted = false
    const { props } = this

    // leave :: LeaveRequest
    const leave = {
      roomID: props.room.id,
      userID: props.userID,
    }

    props.socket.emit('leave', leave)
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

  handleSubmit2 = (text, image) => {
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
      props.socket.emit('message', message)
      this.scrollToBottom()
    })
  }

  // handleSubmit :: Event -> void
  handleSubmit = e => {
    e.preventDefault()

    const inputNode = e.target.message
    const text = inputNode.value
    const { props, state } = this

    if (!text.trim() && !state.image) return

    // message :: Message
    const message = {
      type: 'default',
      sender: props.userID,
      text: inputNode.value,
      room: props.room.id,
      image: state.image,
    }

    this.setState(({ messages }) => ({
      messages: [...messages, message],
      image: null,
    }), () => {
      props.socket.emit('message', message)
      inputNode.value = ''
      this.scrollToBottom()
    })
  }

  handleFileChange = async e => {
    e.persist()
    const [file] = e.target.files

    if (!file) return

    const imageData = await getImageData(file)

    this.setState({ image: imageData.data }, () => {
      e.target.value = null
      this.inputRef.current.focus()
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
    <div className={styles.editor}>
      <div className={styles.editorLeft}>
        <label
          className={styles.sendImageButton}
          htmlFor="file"
        >
          <input
            className={styles.file}
            id="file"
            type="file"
            accept="image/*"
            onChange={this.handleFileChange}
          />
          <ImageIcon />
        </label>
      </div>

      <form
        className={styles.editorRight}
        onSubmit={this.handleSubmit2}
      >
        {this.state.image && (
          <img
            alt=""
            className={styles.imagePreview}
            src={this.state.image}
          />
        )}
        <div className={styles.field}>
          <input
            ref={this.inputRef}
            className={styles.input}
            autoFocus
            autoComplete="off"
            name="message"
            type="text"
            placeholder="Type here"
          />
          <button className={styles.sendButton} type="submit">
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  )

  renderInviteModal = () => (
    <Invite
      show={this.state.showUserList}
      close={this.hideInviteModal}
      service={this.props.service}
      userID={this.props.userID}
      socket={this.props.socket}
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
        {/* {this.renderEditor()} */}
        <Editor
          onSubmit={this.handleSubmit2}
        />
        {this.renderInviteModal()}
      </Animated.div>
    )
  }
}


// getImageData :: File -> Promise<{ data: string }>
const getImageData = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        resolve({
          data: reader.result,
        })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default ChatRoom