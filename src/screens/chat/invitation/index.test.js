import React from 'react'
import Invitation from './index'
import { render, cleanup, fireEvent } from 'react-testing-library'

const INVITATION = {
  senderID: 'Tom',
  room: { title: 'Mars' },
}

afterEach(cleanup)

describe('Invitation', () => {
  it('shows invitation mesage', () => {
    const invitation = INVITATION
    const { container } = render(
      <Invitation invitation={invitation} />
    )

    expect(container.textContent).toMatch('Tom invited')
    expect(container.textContent).toMatch('Mars')
    expect(container.textContent).toMatch('Yes')
    expect(container.textContent).toMatch('No')
  })

  it('calls props.onYes() on accept', () => {
    const invitation = INVITATION
    const onYes = jest.fn()
    const { getByText } = render(
      <Invitation invitation={invitation} onYes={onYes} />
    )

    fireEvent.click(getByText(/yes/i))

    expect(onYes).toHaveBeenCalledTimes(1)
  })

  it('calls props.onYes() on accept', () => {
    const invitation = INVITATION
    const onNo = jest.fn()
    const { getByText } = render(
      <Invitation invitation={invitation} onNo={onNo} />
    )

    fireEvent.click(getByText(/no/i))

    expect(onNo).toHaveBeenCalledTimes(1)
  })
})