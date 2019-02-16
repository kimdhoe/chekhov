import React, { Component } from 'react';

import { Chat } from './screens'


class App extends Component {
  render() {
    return (
      <div className="App" style={{ height: '100%' }}>
        <Chat />
      </div>
    );
  }
}

export default App;
