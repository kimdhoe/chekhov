import React from 'react'
import Chat from './index'
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('<Chat />', () => {
  it('renders without crashing', () => {
    const userID = 'kdh'
    const fakeService = {
      installReconnectionHandler: () => {},
      installInvitationHandler: () => {},
    }
    const fakeSocket = {
      emit: () => {},
      on: () => {},
    }

    render(
      <Chat service={fakeService} userID={userID} socket={fakeSocket} />
    )
  })

  it('installs socket-reconnection handler on mount', () => {
    const userID = 'kdh'
    const fakeService = {
      installReconnectionHandler: jest.fn(),
      installInvitationHandler: jest.fn(),
    }
    const fakeSocket = {
      emit: () => {},
      on: () => {},
    }

    render(
      <Chat service={fakeService} userID={userID} socket={fakeSocket} />
    )

    expect(fakeService.installReconnectionHandler).toHaveBeenCalled()
  })

  it('installs invitation handler on mount', () => {
    const userID = 'kdh'
    const fakeService = {
      installReconnectionHandler: jest.fn(),
      installInvitationHandler: jest.fn(),
    }
    const fakeSocket = {
      emit: () => {},
      on: () => {},
    }

    render(
      <Chat service={fakeService} userID={userID} socket={fakeSocket} />
    )

    expect(fakeService.installInvitationHandler).toHaveBeenCalled()
  })
})