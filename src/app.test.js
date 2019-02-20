import React from 'react'
import ReactDOM from 'react-dom'
import { render, cleanup, fireEvent } from 'react-testing-library'

import App from './app'

afterEach(cleanup)

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
      <App socket={{ a: 1 }} service={{ a: 1 }} />,
      div,
    )
    ReactDOM.unmountComponentAtNode(div)
  });

  it('shows welcome screen at first', () => {
    const { container } = render(<App socket={{ a: 1 }} service={{ a: 1 }} />)

    expect(container.textContent).toMatch('Kakao Chat')
  })

  it('', () => {
    const { container, getByText } = render(
      <App socket={{ a: 1 }} service={{ a: 1 }} />
    )

    fireEvent.click(getByText(/connect/i))

    expect(container.textContent).toMatch(/please choose/i)
  })
})