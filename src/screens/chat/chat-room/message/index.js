import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'

import * as styles from './index.module.css'

const AnimatedP = Animated.createAnimatedComponent('p')

class Message extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    mine: PropTypes.bool.isRequired,
  }

  opacity = new Animated.Value(0)
  translateX = this.opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [this.props.mine ? 10 : -10, 0],
  })
  translateY = this.opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 0],
  })

  componentDidMount() {
    this.enter()
  }

  // enter :: -> void
  // Reveals message with animation.
  enter = () => {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 150,
    }).start()
  }

  renderAnnouncement = () => (
    <AnimatedP
      className={styles.announcement}
      style={{
        opacity: this.opacity,
        transform: [{ translateY: this.translateY }],
      }}
    >
      {this.props.message.text}
    </AnimatedP>
  )

  renderDefault = () => {
    const { mine, message } = this.props

    return (
      <Animated.div
        className={[styles.message, mine && styles.myMessage].join(' ')}
        style={{
          opacity: this.opacity,
          transform: [
            { translateX: this.translateX },
            { translateY: this.translateY },
          ],
        }}
      >
        {!mine && (
          <p className={styles.messageSender}>{message.sender}</p>
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
          <p className={styles.messageText}>{message.text}</p>
        )}
      </Animated.div>
    )
  }

  render() {
    if (this.props.message.type === 'announcement') {
      return this.renderAnnouncement()
    }
    return this.renderDefault()
  }
}

export default Message