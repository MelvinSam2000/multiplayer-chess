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
        this.child = React.createRef()
        this.user = this.props.location.state.user
        this.rival = this.props.location.state.rival
        this.socket = io.connect(`${serverURL}/game`, {query: `user=${this.user}&rival=${this.rival}`})
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
            }
        }
    }

    componentDidMount() {

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
            this.child.current.movePiece(piece, oldPos, newPos)
            this.setState((state) => ({
                myTurn: !state.myTurn
            }))
        })

        // handle game over
        this.socket.on("gameOver", (user) => {
            console.log(user)
            if (this.user === user) {
                alert("You win!")
            } else {
                alert("You lose!")
            }
            this.props.history.push({
                pathname: "/lobby",
                state: {
                    user: this.user
                }
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

    render() {

        if (!this.state.loaded) {
            return <div>Loading...</div>
        }
        return (
            <div>
                <div className="GameBox">
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
                    <ChessBoard 
                        ref={this.child}
                        isWhite={this.state.first} 
                        myTurn={this.state.myTurn}
                        chessTile={this.state.chessTile}
                        changeTurn={this.changeTurn}
                        checkMate={this.checkMate}
                    />
                </div>
                <div>

                </div>
            </div>
        )
    }
}