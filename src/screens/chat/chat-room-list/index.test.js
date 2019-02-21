import React from 'react'
import ChatRoomList from './index'
import { render, cleanup, waitForDomChange } from 'react-testing-library'

afterEach(cleanup)

describe('ChatRoomList', () => {
  it('shows greeting text', () => {
    const userID = 'a'
    const service = {}
    const onPressRoom = jest.fn()

    const { container } = render(
      <ChatRoomList
        userID={userID}
        service={service}
        onPressRoom={onPressRoom}
      />
    )

    expect(container.textContent).toMatch(userID)
    expect(container.textContent).toMatch(/hello/i)
    expect(container.textContent).toMatch(/what do you want to chat about/i)
  })

  it('calls service function to fetch rooms', () => {
    const userID = 'a'
    const service = { fetchRooms: jest.fn() }
    const onPressRoom = jest.fn()

    render(
      <ChatRoomList
        userID={userID}
        service={service}
        onPressRoom={onPressRoom}
      />
    )

    expect(service.fetchRooms).toHaveBeenCalled()
  })

  it('shows list of rooms', async () => {
    const service = {
      fetchRooms: jest.fn(() => Promise.resolve({
        rooms: [
          { id: 'a', title: 'Moon', color: 'black', participants: [] },
          { id: 'b', title: 'Mercury', color: 'black', participants: [] },
          { id: 'c', title: 'Mars', color: 'black', participants: [] },
        ],
      })),
    }
    const { container } = render(
      <ChatRoomList
        userID={'user'}
        service={service}
        onPressRoom={() => { }}
      />
    )

    await waitForDomChange({ container })

    expect(container.textContent).toMatch('Moon')
    expect(container.textContent).toMatch('Mercury')
    expect(container.textContent).toMatch('Mars')
  })
})