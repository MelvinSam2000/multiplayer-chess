import React from 'react'
import io from 'socket.io-client'
import ChessBoard from './chessboard'
import '../css/game.css'

const host = process.env.REACT_APP_SERVER_HOST
const port = process.env.PORT || 8000
const serverURL = `${host}:${port}`

export default class Game extends React.Component {

    constructor(props) {
        super(props)
        this.user = this.props.location.state.user
        this.rival = this.props.location.state.rival
        this.state = {
            loaded: false,
            first: false,
            myTurn: false,
            chessTile: {
                "a": Array(8).fill(""),
                "b": Array(8).fill(""),
                "c": Array(8).fill(""),
                "d": Array(8).fill(""),
                "e": Array(8).fill(""),
                "f": Array(8).fill(""),
                "g": Array(8).fill(""),
                "h": Array(8).fill("")
            },
            winner: ""
        }
    }

    componentDidMount() {

        this.socket = io.connect(`${serverURL}/game`, {query: `user=${this.user}&rival=${this.rival}`})

        // assign turns of initial state
        this.socket.on("turnsAssigned", (turn) => {
            let players = [this.user, this.rival].sort()
            if (players[turn] === this.user) {
                this.setState({
                    first: true,
                    myTurn: true
                })
            }
            this.setState({
                loaded: true
            })
        })

        // handle turn switching
        this.socket.on("turnSwap", (move) => {
            let [piece, oldPos, newPos] = move
            this.setState(state => {
                // set new position
                state.chessTile[newPos[0]][newPos[1]] = piece
                // clear old position
                state.chessTile[oldPos[0]][oldPos[1]] = "" 
            })
            this.setState((state) => ({
                myTurn: !state.myTurn
            }))
        })

        // handle game over
        this.socket.on("gameOver", (user) => {
            this.setState({
                myTurn: false,
                winner: user
            })
        })

        // handle opponent left
        this.socket.on("opponentLeft", () => {
            alert(`Opponent ${this.rival} has left...`)
            this.setState({
                myTurn: false,
                winner: this.user
            })
        })

        // handle server crash
        this.socket.on("disconnect", () => {
            this.props.history.push("/")
        })
    }

    changeTurn = (piece, oldPos, newPos) => {
        this.socket.emit("turnDone", [piece, oldPos, newPos])
    }

    checkMate = () => {
        this.socket.emit("checkMate", this.user)
    }

    goBack = () => {
        this.socket.disconnect()
        this.props.history.push({
            pathname: "/lobby",
            state: {
                user: this.user
            }
        })
    }

    render() {

        if (!this.state.loaded) {
            return <div>Loading...</div>
        }
        return (
            <div>
                <div className="GameBox">
                    <ChessBoard 
                        isWhite={this.state.first} 
                        myTurn={this.state.myTurn}
                        chessTile={this.state.chessTile}
                        changeTurn={this.changeTurn}
                        checkMate={this.checkMate}
                    />
                </div>
                <div className="InfoPanel">
                    {this.state.winner === "" ? (
                        <div>
                            <div>
                                Playing against {this.rival}
                            </div>
                            {this.state.myTurn ? (
                                <div>
                                    Your turn!
                                </div>
                            ) : (
                                <div>
                                    Waiting...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {this.state.winner === this.user ? (
                                <div>
                                    You win!
                                </div>
                            ) : (
                                <div>
                                    You lose
                                </div>  
                            )}
                        </div>
                    )}
                    <button onClick={this.goBack}>
                        Leave
                    </button>
                </div>
            </div>
        )
    }
}