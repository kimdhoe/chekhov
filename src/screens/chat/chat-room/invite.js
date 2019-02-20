import React from 'react'
import Animated from 'animated/lib/targets/react-dom'

import CloseIcon from '../../../components/close-icon'
import * as styles from './invite.module.css'

// -------------------------------------
// Constants
// -------------------------------------

// ANIM_DURATION :: number
// Duration of entering animation in ms.
const ANIM_DURATION = 150

// -------------------------------------
// Data Definitions
// -------------------------------------

// An InviteState is an object: { show:      boolean
//                              , isPending: boolean
//                              , users:     string[]
//                              , invitee:   string
//                              }

// -------------------------------------
// Component
// -------------------------------------

class Invite extends React.Component {
  containerRef = React.createRef()

  // Animated values:
  opacity = new Animated.Value(0)
  translateY = this.opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  })

  // state :: InviteState
  state = {
    show: false,
    isPending: true,
    users: [],
    invitee: null,
  }

  async componentDidUpdate(prevProps) {
    const { props } = this
    const shouldShow = !prevProps.show && props.show
    const shouldHide = prevProps.show && !props.show

    if (shouldShow) {
      this.show()
    } else if (shouldHide) {
      this.hide()
    }
  }

  componentWillUnmount() {
    this.tearDown()
  }

  tearDown = () => {
    window.removeEventListener('click', this.handleWindowClick)
  }

  show = async () => {
    const { props } = this
    const users = await props.service.fetchAllUsers()

    this.setState({
      show: true,
      isPending: false,
      users: users.filter(id => id !== props.userID),
    }, () => {
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: ANIM_DURATION,
      }).start(() => {
        window.addEventListener('click', this.handleWindowClick)
      })
    })
  }

  hide = () => {
    this.tearDown()
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: ANIM_DURATION,
    }).start(() => {
      this.setState({
        isPending: true,
        users: [],
        show: false,
      })
    })
  }

  // handleWindowClick :: Event -> void
  // Closes modal if the event target is this component or a descendant of it.
  handleWindowClick = e => {
    let node = e.target

    while (node) {
      if (node === this.containerRef.current.refs.node) return
      node = node.parentNode
    }

    this.props.close()
  }

  // handlePress :: string -> void
  // Handles user selection.
  handlePress = receiverID => {
    const { props } = this
    props.service.invite(props.userID, receiverID, props.room, props.close)
  }

  renderPlaceholder = () => (
    <div className={styles.users}>
      <div className={styles.placeholderItem} />
      <div className={styles.placeholderItem} />
      <div className={styles.placeholderItem} />
    </div>
  )

  renderUsers = () => {
    const { users } = this.state

    return (
      <ul className={styles.users}>
        {users.length > 0
          ? users.map(user => (
            <li key={user} className={styles.user}>
              <button
                className={styles.userButton}
                onClick={() => this.handlePress(user)}
              >
                {user}
              </button>
            </li>
          ))
          : (
            <p className={styles.emptyUsers}>
              There's no one to invite at the moment.
            </p>
          )
        }
      </ul>
    )
  }

  render() {
    const { close } = this.props
    const { show, isPending } = this.state

    if (!show) return null

    return (
      <Animated.div
        ref={this.containerRef}
        className={styles.container}
        style={{
          opacity: this.opacity,
          transform: [
            { translateY: this.translateY },
          ],
        }}
      >
        <h2 className={styles.heading}>Invite</h2>

        <button className={styles.closeButton} onClick={close}>
          <CloseIcon />
        </button>

        <div className={styles.content}>
          {isPending
            ? this.renderPlaceholder()
            : this.renderUsers()
          }
        </div>
      </Animated.div>
    )
  }
}

export default Invite