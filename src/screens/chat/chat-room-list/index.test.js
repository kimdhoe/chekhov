import React from 'react'
import ChatRoomList from './index'
import { render, cleanup, fireEvent } from 'react-testing-library'

afterEach(cleanup)

describe('ChatRoomList', () => {
  it('shows greeting text', () => {
    const userID = 'a'
    const socket = { emit: jest.fn() }
    const onPressRoom = jest.fn()

    const { container } = render(
      <ChatRoomList
        userID={userID}
        socket={socket}
        onPressRoom={onPressRoom}
      />
    )

    expect(container.textContent).toMatch(userID)
    expect(container.textContent).toMatch(/hello/i)
    expect(container.textContent).toMatch(/what do you want to chat about/i)
  })

  it('calls service function to fetch rooms', () => {
    const userID = 'a'
    const socket = { emit: jest.fn() }
    const service = { fetchRooms: jest.fn() }
    const onPressRoom = jest.fn()

    const { container } = render(
      <ChatRoomList
        userID={userID}
        socket={socket}
        service={service}
        onPressRoom={onPressRoom}
      />
    )

    expect(service.fetchRooms).toHaveBeenCalled()
  })

  // TODO
  it('shows list of rooms', () => {

  })
})