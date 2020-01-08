import React from 'react'

const charCoord = ["a", "b", "c", "d", "e", "f", "g", "h"]

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
            this.movePiece(piece, oldPos, newPos)
            // end turn
            this.props.changeTurn(piece, oldPos, newPos)
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
        this.setState(state => {
            // check move is valid 

            // set new position
            state.chessTile[newPos[0]][newPos[1]] = piece

            // clear old position
            state.chessTile[oldPos[0]][oldPos[1]] = "" 
        })
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