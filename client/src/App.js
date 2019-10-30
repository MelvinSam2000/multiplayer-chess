import React from 'react'
import './css/App.css'
import io from 'socket.io-client'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Game from './components/game'
import Home from './components/home'
import Lobby from './components/lobby'

const port = process.env.PORT || 8000

class App extends React.Component {

  componentDidMount() {
    this.socket = io.connect(`http://localhost:${port}/lobby`)
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/lobby" component={Lobby}/>
            <Route exact path="/game" component={Game}/>
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
