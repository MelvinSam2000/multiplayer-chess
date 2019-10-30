import React from 'react'
import './css/App.css'
import io from 'socket.io-client'

const port = process.env.PORT || 8000

class App extends React.Component {

  componentDidMount() {
    this.socket = io.connect(`http://localhost:${port}/lobby`)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Hello World
        </header>
      </div>
    )
  }
}

export default App;
