import React from 'react'
import Animated from 'animated/lib/targets/react-dom'

import * as styles from './index.module.css'

const Invitation = ({ invitation, onYes, onNo, opacity, translateY }) => {
  const message =
    `${invitation.senderID} invited you to ${invitation.room.title}. ` +
    'Do you accept?'

  return (
    <Animated.div
      className={styles.container}
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <p className={styles.message}>{message}</p>

      <div className={styles.buttonsContainer}>
        <button className={styles.button} onClick={onYes}>
          Yes
        </button>
        <button className={styles.button} onClick={() => onNo()}>
          No
        </button>
      </div>
    </Animated.div >
  )
}

export default Invitation