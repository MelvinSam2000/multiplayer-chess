import React from 'react'

const charCoord = ["a", "b", "c", "d", "e", "f", "g", "h"]
const charToIndex = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7
}

export default class ChessBoard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            pieceSelected: {
                piece: "",
                location: {
                    char: "",
                    int: ""
                }
            },
            chessTile: props.chessTile
        }
    }

    componentDidMount() {
        this.setInitialPosition()
    }
    
    updatePosition = (position) => {
        if (!this.props.myTurn) {
            return
        }
        let [charPos, intPos] = position
        let piece = this.state.pieceSelected.piece

        if (piece === "") {
            // Chosen piece is of valid color
            if (this.props.isWhite && this.state.chessTile[charPos][intPos][0] === "B"
                || !this.props.isWhite && this.state.chessTile[charPos][intPos][0] === "W") {
                return
            } 
            this.setState({
                pieceSelected: {
                    piece: this.state.chessTile[charPos][intPos],
                    location: `${charPos}${intPos}`
                }
            })
        } else {
            let oldPos = this.state.pieceSelected.location
            let newPos = `${charPos}${intPos}`
            this.setState({
                pieceSelected: {
                    piece: "",
                    location: ""
                }
            })
            if (oldPos === newPos) {
                return
            }
            let valid = this.movePiece(piece, oldPos, newPos)
            // end turn
            if (valid) {
                this.props.changeTurn(piece, oldPos, newPos)
            }
        }
    }

    setInitialPosition = () => {
        // Set pawns
        Object.keys(this.state.chessTile).map((char, i) => {
            this.setState(state => {
                state.chessTile[char][1] = "WP"
                state.chessTile[char][6] = "BP"
                return state
            })
        })
        this.setState(state => {
            // Set rooks
            state.chessTile["a"][0] = "WR"
            state.chessTile["a"][7] = "BR"
            state.chessTile["h"][0] = "WR"
            state.chessTile["h"][7] = "BR"
            // Set knights
            state.chessTile["b"][0] = "WN"
            state.chessTile["b"][7] = "BN"
            state.chessTile["g"][0] = "WN"
            state.chessTile["g"][7] = "BN"
            // Set bishops
            state.chessTile["c"][0] = "WB"
            state.chessTile["c"][7] = "BB"
            state.chessTile["f"][0] = "WB"
            state.chessTile["f"][7] = "BB"
            // Set queen and king
            state.chessTile["d"][0] = "WQ"
            state.chessTile["d"][7] = "BQ"
            state.chessTile["e"][0] = "WK"
            state.chessTile["e"][7] = "BK"
        })

    }

    movePiece = (piece, oldPos, newPos) => {
        // check move is valid
        let valid = true
        switch (piece[1]) {
            // Pawns functionality
            case "P":
                // Pawns cant go backwards
                if (piece[0] === "W" && oldPos[1] > newPos[1]
                    || piece[0] === "B" && oldPos[1] < newPos[1]) {
                        return false
                } 
                // Pawns can only go vertically, unless they can capture enemy piece
                if (oldPos[0] !== newPos[0]) {
                    let [oldCol, newCol] = [charToIndex[oldPos[0]], charToIndex[newPos[0]]]
                    if (piece[0] === "W") {
                        if (Math.abs(oldCol - newCol) === 1 && newPos[1] - oldPos[1] === 1) {
                            if (this.state.chessTile[newPos[0]][newPos[1]] === "" 
                                || this.state.chessTile[newPos[0]][newPos[1]][0] === "W") {
                                return false
                            }
                        } else {
                            return false
                        }
                    } else {
                        if (Math.abs(oldCol - newCol) === 1 && oldPos[1] - newPos[1] === 1) {
                            if (this.state.chessTile[newPos[0]][newPos[1]] === ""
                                || this.state.chessTile[newPos[0]][newPos[1]][0] === "B") {
                                return false
                            }
                        } else {
                            return false
                        }
                    }
                }
                // Pawns can only move 1 ahead, or 2 at the begining, without colliding or passing
                if (Math.abs(newPos[1] - oldPos[1]) > 2) {
                    return false
                }
                if (Math.abs(newPos[1] - oldPos[1]) === 2) {
                    if (oldPos[1] !== "1" && oldPos[1] !== "6"
                        || newPos[1] === "3" && this.state.chessTile[newPos[0]][2] !== ""
                        || newPos[1] === "4" && this.state.chessTile[newPos[0]][5] !== "") {
                        return false
                    }
                }
                if (oldPos[0] === newPos[0] && this.state.chessTile[newPos[0]][newPos[1]] !== "") {
                    return false
                }
                break
            default:
                break
        }
        if (valid) {
            this.setState(state => {
                // set new position
                state.chessTile[newPos[0]][newPos[1]] = piece
                // clear old position
                state.chessTile[oldPos[0]][oldPos[1]] = "" 
            })
        }
        return valid
    }

    render() {

        if (!this.state.loaded){
            return <div>Loading...</div>
        }

        return (
            <div> 
                {this.props.isWhite ? ("WHITE") : ("BLACK")} <br/>
                {this.state.pieceSelected.piece === "" ? ("") : (`Selected: ${JSON.stringify(this.state.pieceSelected)}`)} <br/>
                <table> {
                    Array(8).fill().map((_, i) => {
                        if (this.props.isWhite) {
                            i = 7 - i
                        }
                        return <tr> {Array(8).fill().map((_, j) => {
                            if (!this.props.isWhite) {
                                j = 7 - j
                            }
                            let char = charCoord[j]
                            let pos = `${char}${i}`
                            return <td id={pos}>
                                <button onClick={() => this.updatePosition([char, i])}>
                                    {this.state.chessTile[char][i]}
                                </button>
                            </td>
                        })} </tr>
                })} </table>
            </div>
        )
    }
}