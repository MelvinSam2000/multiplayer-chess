import React from 'react'
import './css/App.css'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Game from './components/game'
import Home from './components/home'
import Lobby from './components/lobby'

require("dotenv").config()

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={(props) => <Home {...props}/>}/>
            <Route path="/lobby" render={(props) => <Lobby {...props}/>}/>
            <Route path="/game" render={(props) => <Game {...props}/>}/>
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
