import React from 'react'

import * as styles from './index.module.css'

class Entrance extends React.Component {
  state = {
    error: 'Something went wrong',
  }

  render () {
    const { error } = this.state

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>Kakao Chat</h1>
        </header>

        <div className={styles.top}>
          <h2 className={styles.subtitle}>
            <span>Have a</span>{' '}
            <span className={styles.highlighted}>Nice Chat</span>
          </h2>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium id porro optio!
          </p>
        </div>

        <div className={styles.bottom}>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="User ID"
            />
          </div>

          <p className={styles.error}>
            {error}
          </p>

          <button
            className={styles.button}
          >
            Connect
          </button>
        </div>
      </div>
    )
  }
}

export default Entrance