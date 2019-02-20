import React from 'react'
import ReactDOM from 'react-dom'
import {
  render,
  cleanup,
  fireEvent,
  wait,
  waitForDomChange,
  waitForElement,
} from 'react-testing-library'

import Entrance from './index'

afterEach(cleanup)

describe('Entrance', () => {
  it('calls onSubmit with the user ID', () => {
    const USER_ID = 'kdh'
    const fakeService = {
      register: jest.fn(() => Promise.resolve()),
    }
    const { getByText, getByPlaceholderText } = render(
      <Entrance
        service={fakeService}
        onRegister={() => { }}
      />
    )
    const input = getByPlaceholderText(/user id/i)

    fireEvent.change(input, { target: { value: USER_ID } })
    fireEvent.click(getByText(/connect/i))

    expect(fakeService.register).toHaveBeenCalledWith(
      USER_ID,
      expect.any(Function),
    )
  })

  it('shows error message on submit failure', async () => {
    const ERROR = 'something went wrong'
    const fakeService = {
      register: jest.fn((id, f) => {
        f({ ok: false, message: ERROR })
      })
    }
    const { container, getByText, getByPlaceholderText } = render(
      <Entrance
        service={fakeService}
        onRegister={() => { }}
      />
    )
    const input = getByPlaceholderText(/user id/i)

    fireEvent.change(input, { target: { value: 'x' } })
    fireEvent.click(getByText(/connect/i))
    await waitForElement(() => getByText(ERROR))

    expect(container.textContent).toMatch(ERROR)
  })

  it('shows error message on submit with no user ID', async () => {
    const { container, getByText } = render(
      <Entrance
        service={{}}
        onRegister={() => { }}
      />
    )

    fireEvent.click(getByText(/connect/i))

    expect(container.textContent).toMatch('Please choose an ID')
  })
})
