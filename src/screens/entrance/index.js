import React from 'react'
import PropTypes from 'prop-types'

import * as styles from './index.module.css'

class Entrance extends React.Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
  }

  state = {
    input: '',
    message: '',
  }

  componentDidMount () {
    console.log(this.props.socket)
  }

  handleChangeInput = e => {
    this.setState({
      input: e.target.value,
      message: '',
    })
  }

  handleSubmit = e => {
    e.preventDefault()

    // userID :: string
    const userID = this.state.input.trim()

    if (!userID) return

    this.props.socket.emit(
      'register',
      userID,
      // boolean * string? -> void
      ({ ok, message }) => {
        if (!ok) {
          this.setState({ message })
        } else {
          this.props.onRegister(userID)
        }
      })
  }

  render() {
    const { input, message } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <h1 className={styles.h1}>
              Kakao Chat
          </h1>
          </header>

          <div className={styles.top}>
            <h2 className={styles.subtitle}>
              Have a <span className={styles.highlighted}>Nice Chat</span>
            </h2>
            <p className={styles.description}>
              The most advanced and beautiful chat application in the universe.
              Everybody should be using this. Choose your name and start chatting now.
          </p>
          </div>

          <form className={styles.bottom} onSubmit={this.handleSubmit}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="text"
                placeholder="User ID"
                value={input}
                onChange={this.handleChangeInput}
              />
            </div>

            <p className={styles.error}>
              {message}
            </p>

            <button type="submit" className={styles.button}>
              Connect
          </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Entrance