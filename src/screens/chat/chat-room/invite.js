import React from 'react'

import * as styles from './invite.module.css'

class Invite extends React.Component {
  state = {
    isPending: true,
    users: [],
    invitee: null,
  }

  async componentDidMount() {
    const { userID, service } = this.props

    const users = await service.fetchAllUsers()

    this.setState({
      isPending: false,
      users: users.filter(id => id !== userID),
    })
  }

  handlePress = receiverID => {
    const { props } = this
console.log(props.room)
    props.service.invite(props.userID, receiverID, props.room)
  }

  render() {
    const { isPending, users } = this.state

    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Invite
        </h2>
        <div className={styles.content}>
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
        </div>
      </div>
    )
  }
}

export default Invite