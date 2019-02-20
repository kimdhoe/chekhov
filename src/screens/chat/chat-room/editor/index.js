import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'animated/lib/targets/react-dom'
import ImageIcon from '../../../../components/image-icon'
import SendIcon from '../../../../components/send-icon'
import CloseIcon from '../../../../components/close-icon'

import * as styles from './index.module.css'

// -------------------------------------
// Data Definitions
// -------------------------------------

// A EditorState is an object: { image: string? }

// -------------------------------------
// Component
// -------------------------------------


class Editor extends React.Component {
  textInputRef = React.createRef()

  // state :: EditorState
  state = {
    image: null,
  }

  handleFileChange = async e => {
    e.persist()
    const [file] = e.target.files

    if (!file) return

    const imageData = await getImageData(file)

    this.setState({ image: imageData.data }, () => {
      e.target.value = null
      this.textInputRef.current.focus()
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const text = e.target.message.value
    const image = this.state.image
    e.target.message.value = ''
    this.setState({ image: null })
    this.props.onSubmit(text, image)
  }

  handleRemoveImagePress = () => {
    this.setState({ image: null })
  }

  render() {
    return (
      <div className={styles.editor}>
        <div className={styles.editorLeft}>
          <label
            className={styles.sendImageButton}
            htmlFor="file"
          >
            <input
              className={styles.file}
              id="file"
              type="file"
              accept="image/*"
              onChange={this.handleFileChange}
            />
            <ImageIcon />
          </label>
        </div>

        <form className={styles.editorRight} onSubmit={this.handleSubmit}>
          {this.state.image && (
            <div className={styles.imageContainer}>
              <img
                alt=""
                className={styles.image}
                src={this.state.image}
              />
              <button
                type="button"
                className={styles.removeImage}
                onClick={this.handleRemoveImagePress}
              >
                <CloseIcon />
              </button>
            </div>
          )}
          <div className={styles.field}>
            <input
              ref={this.textInputRef}
              className={styles.input}
              autoFocus
              autoComplete="off"
              name="message"
              type="text"
              placeholder="Type here"
            />
            <button className={styles.sendButton} type="submit">
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    )
  }
}

// getImageData :: File -> Promise<{ data: string }>
const getImageData = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        resolve({
          data: reader.result,
        })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default Editor