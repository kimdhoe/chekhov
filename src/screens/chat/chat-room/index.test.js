import React from 'react'
import ChatRoom from './index'
import { render, cleanup, fireEvent, waitForDomChange } from 'react-testing-library'

afterEach(cleanup)

describe('<ChatRoom />', () => {
  it('installs message handler', () => {
    const service = {
      installMessageHandler: jest.fn(),
      joinRoom: jest.fn(),
      leaveRoom: jest.fn(),
    }
    render(
      <ChatRoom
        service={service}
        userID={'aaa'}
        room={{ id: '123', title: '123', color: 'black' }}
        onPressBack={() => {}}
      />
    )

    expect(service.installMessageHandler).toHaveBeenCalled()
  })

  it('emits join event with room-id and user-id', () => {
    const service = {
      installMessageHandler: jest.fn(),
      joinRoom: jest.fn(),
      leaveRoom: jest.fn(),
    }
    render(
      <ChatRoom
        service={service}
        userID={'aaa'}
        room={{ id: '123', title: '123', color: 'black' }}
        onPressBack={() => { }}
      />
    )

    expect(service.joinRoom).toHaveBeenCalledWith('123', 'aaa')
  })

  it('displays invite modal when plus button is pressed', () => {
    const service = {
      installMessageHandler: jest.fn(),
      joinRoom: jest.fn(),
      leaveRoom: jest.fn(),
    }
    const { container, getByTestId } = render(
      <ChatRoom
        service={service}
        userID={'aaa'}
        room={{ id: '123', title: '123', color: 'black' }}
        onPressBack={() => { }}
      />
    )

    fireEvent.click(getByTestId('plusButton'))

    expect(container.textContent).toMatch(/invite/i)
  })
})