import React from 'react'
import PropTypes from 'prop-types'
import ImageIcon from '../../../../components/image-icon'
import SendIcon from '../../../../components/send-icon'
import CloseIcon from '../../../../components/close-icon'

import * as styles from './index.module.css'
import { asap } from 'rsvp';

// -------------------------------------
// Data Definitions
// -------------------------------------

// A EditorState is an object: { image: string? }

// -------------------------------------
// Component
// -------------------------------------


class Editor extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

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

        <form data-testid="editorForm" className={styles.editorRight} onSubmit={this.handleSubmit}>
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
            <button data-testid="sendButton" className={styles.sendButton} type="submit">
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
  const max = 500
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        let width = img.naturalWidth
        let height = img.naturalHeight
        if (width > max || height > max) {
          if (width > height) {
            height = height * (max / width)
            width = max
          } else {
            width = width * (max / height)
            height = max
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const data = ctx.canvas.toDataURL(img, file.type)
        resolve({ data })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default Editor