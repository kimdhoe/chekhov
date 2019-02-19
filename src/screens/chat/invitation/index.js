import React from 'react'

import * as styles from './index.module.css'

const Invitation = ({ invitation }) => {
  const message =
    `${invitation.senderID} invited you to ${invitation.room.title}. ` +
    'Do you accept?'

  return (
    <div className={styles.container}>
      <p className={styles.message}>
        {message}
      </p>

      <div className={styles.buttonsContainer}>
        <button
          className={styles.button}
          onClick={() => {}}
        >
          Yes
      </button>
        <button
          className={styles.button}
          onClick={() => {}}
        >
          No
      </button>
      </div>
    </div >
  )
}

export default Invitation