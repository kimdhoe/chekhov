import React from 'react'
import Message from './index'
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('<Message />', () => {
  it('displays announcement', () => {
    const message = {
      type: 'announcement',
      text: 'Hello',
    }

    const { container } = render(
      <Message message={message} mine={false} />
    )

    expect(container.textContent).toMatch('Hello')
  })

  it('displays my message', () => {
    const message = {
      type: 'default',
      text: 'Hello',
      sender: 'sender'
    }

    const { container } = render(
      <Message message={message} mine={true} />
    )

    expect(container.textContent).toMatch('Hello')
    expect(container.textContent).not.toMatch('sender')
  })

  it("displays other people's message", () => {
    const message = {
      type: 'default',
      text: 'Hello',
      sender: 'sender'
    }

    const { container } = render(
      <Message message={message} mine={false} />
    )

    expect(container.textContent).toMatch('Hello')
    expect(container.textContent).toMatch('sender')
  })

  it('displays image', () => {
    const message = {
      type: 'default',
      text: 'Hello',
      sender: 'sender',
      image: 'https://placehold.it/10x10',
    }

    const { getByTestId } = render(
      <Message message={message} mine={false} />
    )

    expect(getByTestId('attachment')).not.toBeNull()
  })
})