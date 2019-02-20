import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'

import * as styles from './index.module.css'
import Message from './message'
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
//                               , imageDimensions: Dimensions?
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

  scrollContainer = React.createRef()

  opacity = new Animated.Value(0)

  // state :: ChatRoomState
  state = {
    messages: [],
    image: null,
    imageDimensions: null,
    showUserList: false,
  }

  componentDidMount() {
    this._isMounted = true
    this.fadeIn()
    const { socket, room, userID } = this.props
    socket.on('invitation', console.log)
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
    const scrollNode = this.scrollContainer.current

    scrollNode.scrollTo({
      top: scrollNode.scrollHeight,
      behavior: animated ? 'smooth' : 'auto',
    })
  }

  hideInviteModal = () => {
    this.setState({ showUserList: false })
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
      imageDimensions: state.imageDimensions,
    }

    this.setState(({ messages }) => ({
      messages: [...messages, message],
      image: null,
      imageDimensions: null,
    }), () => {
      props.socket.emit('message', message)
      inputNode.value = ''
      // inputNode.blur()
      this.scrollToBottom()
    })
  }

  getImageData = file => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
            data: reader.result,
          })
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    })
  }

  handleFileChange = async e => {
    const [file] = e.target.files

    if (!file) return

    const imageData = await this.getImageData(file)

    this.setState({
      image: imageData.data,
      imageDimensions: {
        width: imageData.width,
        height: imageData.height,
      },
    })
  }

  handleInvitePress = () => {
    this.setState({ showUserList: true })
  }

  render() {
    const { userID, room, onPressBack } = this.props
    const { messages, showUserList } = this.state

    return (
      <Animated.div
        className={styles.container}
        style={{ opacity: this.opacity }}
      >
        <div
          className={styles.headerContainer}
          style={{ backgroundColor: room.color }}
        >
          <header className={styles.header}>
            <button
              className={styles.backButton}
              onClick={() => {
                this.fadeOut(onPressBack)
                // onPressBack()
              }}
            >
              <ArrowBackIcon />
            </button>

            <h2 className={styles.titleText}>
              {room.title}
            </h2>

            <button
              className={styles.inviteButton}
              onClick={this.handleInvitePress}
            >
              <PlusIcon />
            </button>
          </header>
        </div>

        <div
          ref={this.scrollContainer}
          className={styles.messagesContainer}
        >
          <div className={styles.messagesWrapper}>
            {messages.map((message, i) => (
              <Message
                key={i}
                message={message}
                mine={message.sender === userID}
              />
            ))}
          </div>
        </div>

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
                accept="image/jpeg,image/png"
                onChange={this.handleFileChange}
              />
              <ImageIcon />
            </label>
          </div>

          <form
            className={styles.editorRight}
            onSubmit={this.handleSubmit}
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

        <Invite
          show={showUserList}
          close={this.hideInviteModal}
          service={this.props.service}
          userID={this.props.userID}
          socket={this.props.socket}
          room={this.props.room}
        />
      </Animated.div>
    )
  }
}

export default ChatRoom