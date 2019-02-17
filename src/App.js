import React, { Component } from 'react';

import {
  Entrance,
  Chat,
} from './screens'


class App extends Component {
  render() {
    return (
      <div className="App" style={{ height: '100%' }}>
        <Entrance />
        {/* <Chat /> */}
      </div>
    );
  }
}

export default App;
