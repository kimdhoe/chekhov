import React from 'react'
import io from 'socket.io-client'

import * as styles from './index.module.css'

// TODO:
const ME = 'Donghee'

// A Message is an object: { sender: string
//                         , text: string
//                         }

const Message = ({ message }) => (
  <div
    className={[
      styles.message,
      message.sender === ME && styles.myMessage
    ].join(' ')}
  >
    {message.sender !== ME && (
      <p className={styles.messageSender}>
        {message.sender}
      </p>
    )}
    <p className={styles.messageText}>
      {message.text}
    </p>
  </div>
)

class Chat extends React.Component {
  state = {
    messages: [
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: ME, text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
      { sender: 'Summer', text: 'hello world' },
    ],
  }

  componentDidMount() {
    this.socket = io('http://localhost:3001')

    this.socket.on('message', message => {
      console.log(message)
    })
  }

  handleSubmit = e => {
    e.preventDefault()

    const inputNode = e.target.message
    const text = inputNode.value

    if (!text.trim()) return

    this.setState(({ messages }) => ({
      messages: [
        ...messages,
        { sender: ME, text: inputNode.value },
      ]
    }), () => {
      // inputNode.value = ''
    })
  }

  render() {
    const { messages } = this.state

    return (
      <div className={styles.container}>
        <header>
          <h2 className={styles.titleText}>
            Chat Room
          </h2>
        </header>

        <div className={styles.messagesContainer}>
          {messages.map((message, i) => (
            <Message key={i} message={message} />
          ))}
        </div>

        <div className={styles.editor}>
          <div className={styles.editorLeft}>
            <button className={styles.sendImageButton} type="button">
              S
            </button>
          </div>

          <form className={styles.editorRight} onSubmit={this.handleSubmit}>
            <input
              className={styles.input}
              name="message"
              type="text"
              placeholder="Type message here."
            />
            <button className={styles.sendButton} type="submit">
              S
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Chat