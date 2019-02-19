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
const APP_SLOGAN = 'Have a Nice Chat'
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
    enter1: new Animated.Value(0),
    enter2: new Animated.Value(0),
    enter3: new Animated.Value(0),
  }

  enter1TranslateY = this.state.enter1.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  })
  enter2TranslateY = this.state.enter2.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  })
  enter3TranslateY = this.state.enter2.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 0],
  })

  inputRef = React.createRef()

  componentDidMount() {
    this.enter()
  }

  enter = () => {
    Animated.stagger(250, [
      Animated.timing(this.state.enter1, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
      Animated.timing(this.state.enter2, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
      Animated.timing(this.state.enter3, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
    ]).start()
  }

  exit = fn => {
    Animated.stagger(70, [
      Animated.timing(this.state.enter3, {
        toValue: 0,
        duration: 350,
      }),
      Animated.timing(this.state.enter2, {
        toValue: 0,
        duration: 350,
      }),
      Animated.timing(this.state.enter1, {
        toValue: 0,
        duration: 350,
      }),
    ]).start(fn)
  }

  // handleChangeInput :: Event -> void
  handleChangeInput = e => {
    this.setState({
      input: e.target.value,
      message: '',
    })
  }

  // handleSubmit :: Event -> void
  handleSubmit = e => {
    e.preventDefault()

    // userID :: string
    const userID = this.state.input.trim()

    if (!userID) return

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

  render() {
    const { input, error } = this.state

    return (
      <Animated.div
        className={styles.container}
        style={{ opacity: this.state.enter1 }}
      >
        <div className={styles.wrapper}>
          <AnimatedHeader
            className={styles.header}
            style={{
              opacity: this.state.enter1,
              transform: [
                { translateY: this.enter1TranslateY },
              ]
            }}
          >
            <h1 className={styles.h1}>{APP_NAME}</h1>
          </AnimatedHeader>

          <Animated.div
            className={styles.top}
            style={{
              opacity: this.state.enter2,
              transform: [
                { translateY: this.enter2TranslateY },
              ]
            }}
          >
            <h2 className={styles.subtitle}>
              {APP_SLOGAN}
            </h2>
            <p className={styles.description}>
              {APP_DESCRIPTION}
            </p>
          </Animated.div>

          <AnimatedForm
            className={styles.bottom}
            style={{
              opacity: this.state.enter3,
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
                value={input}
                onChange={this.handleChangeInput}
              />
            </div>

            <p className={styles.error}>{error}</p>

            <button type="submit" className={styles.button}>
              Connect
            </button>
          </AnimatedForm>
        </div>
      </Animated.div>
    )
  }
}

export default Entrance