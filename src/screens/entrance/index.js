import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'
import Easing from 'animated/lib/Easing'

import * as styles from './index.module.css'

const { stagger, timing, createAnimatedComponent, Value } = Animated
const AnimatedHeader = createAnimatedComponent('header')
const AnimatedForm = createAnimatedComponent('form')

// -------------------------------------
// Constants
// -------------------------------------

const TRANSLATE_Y_INTERPOLATION = {
  inputRange: [0, 1],
  outputRange: [15, 0],
}
const ENTER_ANIMATION_CONFIG = {
  toValue: 1,
  duration: 500,
  easing: Easing.inOut(Easing.quad),
}
const EXIT_ANIMATION_CONFIG = {
  toValue: 0,
  duration: 350,
}
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

  inputRef = React.createRef()

  enter1 = new Value(0)
  enter2 = new Value(0)
  enter3 = new Value(0)
  translateY1 = this.enter1.interpolate(TRANSLATE_Y_INTERPOLATION)
  translateY2 = this.enter2.interpolate(TRANSLATE_Y_INTERPOLATION)
  translateY3 = this.enter3.interpolate(TRANSLATE_Y_INTERPOLATION)

  // state :: EntranceState
  state = {
    input: '',
    error: '',
  }

  componentDidMount() {
    this.enter()
  }

  // enter :: -> void
  // Reveals components with animation.
  enter = () => {
    stagger(250, [
      timing(this.enter1, ENTER_ANIMATION_CONFIG),
      timing(this.enter2, ENTER_ANIMATION_CONFIG),
      timing(this.enter3, ENTER_ANIMATION_CONFIG),
    ]).start()
  }

  // exit :: -> void
  // Hides components with animation.
  exit = fn => {
    stagger(70, [
      timing(this.enter3, EXIT_ANIMATION_CONFIG),
      timing(this.enter2, EXIT_ANIMATION_CONFIG),
      timing(this.enter1, EXIT_ANIMATION_CONFIG),
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
          { translateY: this.translateY1 },
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
          { translateY: this.translateY2 },
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
          { translateY: this.translateY3 },
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