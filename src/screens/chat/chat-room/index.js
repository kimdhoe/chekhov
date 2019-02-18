import React from 'react'
import PropTypes from 'prop-types'

import * as styles from './index.module.css'
import ArrowBackIcon from './arrow-back-icon'
import ImageIcon from './image-icon'
import SendIcon from './send-icon'

// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatRoomState is an object: { messages:        Message[]
//                               , image:           string?,
//                               , imageDimensions: Dimensions?
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

  // state :: ChatRoomState
  state = {
    messages: [],
    image: null,
    imageDimensions: null,
  }

  componentDidMount() {
    const { socket, room, userID } = this.props

    socket.on('message', message => {
      this.setState(
        state => ({ messages: [...state.messages, message] }),
        this.scrollToBottom,
      )
    })

    // joinRequest :: JoinRequest
    const joinRequest = {
      roomID: room.id,
      userID,
    }

    // Re-join room when socket reconnects.
    //   * This happens when server restarts.
    socket.on('connect', () => {
      socket.emit('join', joinRequest)
    })

    socket.emit('join', joinRequest)
  }

  componentWillUnmount() {
    const { props } = this

    // leaveRequest :: LeaveRequest
    const leaveRequest = {
      roomID: props.room.id,
      userID: props.userID,
    }

    props.socket.emit('leave', leaveRequest)
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
      inputNode.blur()
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
      imageDimensions: { width: imageData.width, height: imageData.height },
    })
  }

  render() {
    const { userID, room, onPressBack } = this.props
    const { messages } = this.state

    return (
      <div className={styles.container}>
        <div
          className={styles.headerContainer}
          style={{ backgroundColor: room.color }}
        >
          <header className={styles.header}>
            <button
              className={styles.backButton}
              onClick={onPressBack}
            >
              <ArrowBackIcon />
            </button>

            <h2 className={styles.titleText}>
              {room.title}
            </h2>
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

          <form className={styles.editorRight} onSubmit={this.handleSubmit}>
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
                // autoFocus
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
      </div>
    )
  }
}

const Message = ({ message, mine = false }) => {
  if (message.type === 'announcement') {
    return (
      <p className={styles.announcement}>
        {message.text}
      </p>
    )
  }

  return (
    <div
      className={[
        styles.message,
        mine && styles.myMessage
      ].join(' ')}
    >
      {!mine && (
        <p className={styles.messageSender}>
          {message.sender}
        </p>
      )}
      {!!message.image && (
        <p className={styles.attachment}>
          <img
            className={styles.messageImage}
            src={message.image}
            alt=""
          />
        </p>
      )}
      {message.text && (
        <p className={styles.messageText}>
          {message.text}
        </p>
      )}
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  mine: PropTypes.bool.isRequired,
}

export default ChatRoom
