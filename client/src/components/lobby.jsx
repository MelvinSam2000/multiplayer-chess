import React from 'react'
import { Route } from 'react-router-dom'
import io from 'socket.io-client'
import "../css/lobby.css"

const port = process.env.PORT || 8000
const serverURL = `http://localhost:${port}`

export default class Lobby extends React.Component {

    constructor(props) {
        super(props)
        this.user = this.props.location.state.user
        this.socket = io.connect(`${serverURL}/lobby`, {query: `user=${this.user}`})
        this.state = {
            numOnlineUsers: 0,
            isSearching: false
        }
    }

    componentDidMount() {

        // request number of online users at an interval
        let msTimeOffset = 5000
        this.socket.emit("req_online_num")
        setInterval(() => this.socket.emit("req_online_num"), msTimeOffset)

        // socket event handlers
        this.socket.on("res_online_num", (num) => {
            this.setState({numOnlineUsers: num})
        })
    }

    playButtonPressed = (history) => {
        this.setState({isSearching: true})
        let searchingSocket = io.connect(`${serverURL}/searching`, {query: `user=${this.user}`})
        searchingSocket.on("gameStarted", (players) => {
            if (!players.includes(this.user)) {
                return
            }

            let rival = players.filter((player) => {
                return player !== this.user
            })

            this.props.history.push({
                pathname: "/game",
                state: {
                    user: this.user,
                    rival: rival
                }
            })
        })
    }

    render() {
        return (
            <div>
                {!this.state.isSearching ? (
                    <div className="Box">
                        <div>
                            Welcome user {this.user} <br/>
                        </div>
                        <div>
                            Currently online: {this.state.numOnlineUsers}
                        </div>
                        <Route render={({history}) => (
                            <button onClick={() => {
                                this.playButtonPressed(history)
                            }}>
                                PLAY
                            </button>
                        )}/>
                        
                    </div>
                ) : (
                    <div className="Box">
                        <div>
                            Searching... <br/>
                        </div>
                        <button>
                            Cancel
                        </button>
                    </div>
                )}
                
            </div>
        )
    }
}