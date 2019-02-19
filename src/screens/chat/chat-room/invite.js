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

    // On show:
    if (!prevProps.show && props.show) {
      const users = await props.service.fetchAllUsers()

      this.setState({
        show: true,
        isPending: false,
        users: users.filter(id => id !== props.userID),
      }, () => {
        Animated.timing(this.opacity, {
          toValue: 1,
          duration: ANIM_DURATION,
        }).start()
      })
      // On hide:
    } else if (prevProps.show && !props.show) {
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
  }

  // handlePress :: string -> void
  handlePress = receiverID => {
    const { props } = this
    props.service.invite(props.userID, receiverID, props.room, props.close)
  }

  // renderUsers :: string[] -> React.Element
  renderUsers = ({ users }) => (
    <ul className={styles.users}>
      {users.map(user => (
        <li key={user} className={styles.user}>
          <button
            className={styles.userButton}
            onClick={() => this.handlePress(user)}
          >
            {user}
          </button>
        </li>
      ))}
    </ul>
  )

  render() {
    const { close } = this.props
    const { show, isPending, users } = this.state

    if (!show) return null

    return (
      <Animated.div
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
            ? null
            : this.renderUsers({ users })
          }
        </div>
      </Animated.div>
    )
  }
}

export default Invite