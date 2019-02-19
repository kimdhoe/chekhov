import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'
import Easing from 'animated/lib/Easing'

import * as styles from './index.module.css'

const AnimatedHeader = Animated.createAnimatedComponent('header')
const AnimatedForm = Animated.createAnimatedComponent('form')

// -------------------------------------
// Constants
// -------------------------------------

const APP_NAME = 'Kakao Chat'
const APP_DESCRIPTION =
  'The most advanced and beautiful chat application in the universe. ' +
  'Everybody should be using this. Choose your name and start chatting now.'

// -------------------------------------
// Data Definitions
// -------------------------------------

// A EntranceState is an object: { input: string
//                               , error: string
//                               }

// -------------------------------------
// Component
// -------------------------------------

class Entrance extends React.Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    onRegister: PropTypes.func.isRequired,
  }

  // state :: EntranceState
  state = {
    input: '',
    error: '',
  }

  enter1 = new Animated.Value(0)
  enter2 = new Animated.Value(0)
  enter3 = new Animated.Value(0)
  enter1TranslateY = this.enter1.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  })
  enter2TranslateY = this.enter2.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  })
  enter3TranslateY = this.enter3.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 0],
  })

  inputRef = React.createRef()

  componentDidMount() {
    this.enter()
  }

  enter = () => {
    Animated.stagger(250, [
      Animated.timing(this.enter1, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
      Animated.timing(this.enter2, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
      Animated.timing(this.enter3, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
    ]).start()
  }

  exit = fn => {
    Animated.stagger(70, [
      Animated.timing(this.enter3, {
        toValue: 0,
        duration: 350,
      }),
      Animated.timing(this.enter2, {
        toValue: 0,
        duration: 350,
      }),
      Animated.timing(this.enter1, {
        toValue: 0,
        duration: 350,
      }),
    ]).start(fn)
  }

  // handleChangeInput :: Event -> void
  handleChangeInput = e => {
    this.setState({
      input: e.target.value,
      error: '',
    })
  }

  // handleSubmit :: Event -> void
  handleSubmit = e => {
    e.preventDefault()

    // userID :: string
    const userID = this.state.input.trim()

    if (!userID) {
      this.setState({
        input: '',
        error: 'Please choose an ID to start.',
      })
      this.inputRef.current.focus()
      return
    }

    this.props.socket.emit(
      'register',
      userID,
      // RegisterResponse -> void
      ({ ok, message }) => {
        if (!ok) {
          this.setState({ error: message }, () => {
            this.inputRef.current.focus()
          })
        } else {
          this.exit(() => {
            this.props.onRegister(userID)
          })
        }
      })
  }

  renderHeader = () => (
    <AnimatedHeader
      className={styles.header}
      style={{
        opacity: this.enter1,
        transform: [
          { translateY: this.enter1TranslateY },
        ]
      }}
    >
      <h1 className={styles.h1}>{APP_NAME}</h1>
    </AnimatedHeader>
  )

  renderBody = () => (
    <Animated.div
      className={styles.top}
      style={{
        opacity: this.enter2,
        transform: [
          { translateY: this.enter2TranslateY },
        ]
      }}
    >
      <h2 className={styles.subtitle}>
        Have a <span className={styles.highlighted}>Nice</span> Chat
      </h2>
      <p className={styles.description}>
        {APP_DESCRIPTION}
      </p>
    </Animated.div>
  )

  renderForm = () => (
    <AnimatedForm
      className={styles.bottom}
      style={{
        opacity: this.enter3,
        transform: [
          { translateY: this.enter3TranslateY },
        ]
      }}
      onSubmit={this.handleSubmit}
    >
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          ref={this.inputRef}
          type="text"
          placeholder="User ID"
          value={this.state.input}
          onChange={this.handleChangeInput}
        />
      </div>

      <p className={styles.error}>{this.state.error}</p>

      <button type="submit" className={styles.button}>
        Connect
      </button>
    </AnimatedForm>
  )

  render() {
    return (
      <Animated.div
        className={styles.container}
        style={{ opacity: this.enter1 }}
      >
        <div className={styles.wrapper}>
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderForm()}
        </div>
      </Animated.div>
    )
  }
}

export default Entrance