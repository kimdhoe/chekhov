import React from 'react'

import * as styles from './index.module.css'

const Invitation = ({ invitation }) => (
  <div className={styles.container}>
    <p className={styles.message}>
      {`${invitation.senderID} wants you to join ${invitation.room.title}. Would you like to accept the invitation?`}
    </p>

    <div className={styles.buttonsContainer}>
      <button
        className={styles.button}
      >
        Yes
      </button>
      <button
        className={styles.button}
      >
        No
      </button>
    </div>
  </div >
)

export default Invitation