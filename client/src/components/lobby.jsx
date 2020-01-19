import React from 'react'
import { Route } from 'react-router-dom'
import io from 'socket.io-client'
import "../css/lobby.css"

const host = process.env.REACT_APP_SERVER_HOST
const port = process.env.PORT || 8000
const serverURL = `${host}:${port}`

export default class Lobby extends React.Component {

    constructor(props) {
        super(props)
        this.user = this.props.location.state.user
        this.state = {
            numOnlineUsers: 0,
            isSearching: false
        }
    }

    componentDidMount() {

        this.socket = io.connect(`${serverURL}/lobby`, {query: `user=${this.user}`})

        // request number of online users at an interval
        let msTimeOffset = 5000
        this.socket.emit("req_online_num")
        setInterval(() => this.socket.emit("req_online_num"), msTimeOffset)

        // handle online number
        this.socket.on("res_online_num", (num) => {
            this.setState({numOnlineUsers: num})
        })

        // handle game starting
        this.socket.on("gameStarted", (players) => {
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

        // handle server crash
        this.socket.on("disconnect", () => {
            this.cancelSearch()
        })
    }

    playButtonPressed = (history) => {
        this.setState({isSearching: true})
        this.socket.emit("searchGame", this.user)
    }

    cancelSearch = () => {
        this.setState({isSearching: false})
        this.socket.emit("searchCancel", this.user)
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
                        <button onClick={this.cancelSearch}>
                            Cancel
                        </button>
                    </div>
                )}
                
            </div>
        )
    }
}