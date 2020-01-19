let onlineUsers = []
let gameQueue = []
let turn = 0

const errorHandler = (socket, message) => {
    console.log(message)
    //socket.emit("error", message)
}

module.exports = (server) => {

    const io = require("socket.io")(server)

    // Handle user connecting to server
    io.of("/lobby").on("connection", (socket) => {

        // Handle user connected
        const user_id = socket.request._query["user"]
        const user = {
            user_id: user_id,
            socket_id: socket.id
        }

        // Check user isnt already connected
        let valid = true
        onlineUsers.forEach(x => {
            if (x.user_id === user_id) { 
                valid = false
            }
        })
        if (valid) {
            onlineUsers.push(user)
            console.log(`${user.user_id} is now online!`)
        }

        // handle disconnection
        socket.on("disconnect", (evt) => {
            // remove user from online users list
            onlineUsers = onlineUsers.filter((elem) => {
                return elem.user_id != user.user_id
            })
            gameQueue = gameQueue.filter((elem) => {
                return elem.user_id != user
            })
        })

        // Return num of online users requested
        socket.on("req_online_num", () => {
            socket.emit("res_online_num", onlineUsers.length)
        })

        // Matchmaking
        socket.on("searchGame", (user) => {
            
            let valid = false
            // Check user is valid and connected
            onlineUsers.forEach((obj) => {
                if (obj.user_id === user) {
                    valid = true
                }
            })
            if (!valid) {
                errorHandler(socket, `User ${user} not recognized`)
                return
            }

            // Check user is valid and connected
            gameQueue.forEach((obj) => {
                if (obj.user_id === user) {
                    errorHandler(socket, "User already in lobby")
                    valid = false
                }
            })

            if (!valid) {
                return
            }

            const user_obj = {
                user_id: user,
                socket_id: socket.id 
            }

            gameQueue.push(user_obj)

            // Matchmake
            if (gameQueue.length >= 2) {
                let user1 = gameQueue.shift()
                let user2 = gameQueue.shift()
                let players = [user1, user2].sort()
                players.forEach(player => {
                    io.of("/lobby").to(player.socket_id).emit("gameStarted", players.map(e => {
                        return e.user_id
                    }))
                })
                // decide white and black randomly
                turn = Math.floor(Math.random() * 2)
            }
        })

        // Handle search cancelling
        socket.on("searchCancel", (user) => {
            gameQueue = gameQueue.filter((elem) => {
                return elem.user_id != user
            })
        })
    })

    // Handle user playing a game
    io.of("/game").on("connection", (socket) => {


        // create room between both users
        const user = socket.handshake.query.user
        const rival = socket.handshake.query.rival
        const players = [user, rival].sort()
        const room = `${players}`
        
        if (io.sockets.adapter.rooms[room]) {
            return
        }

        socket.join(room)

        // assign turns
        io.of("/game").to(room).emit("turnsAssigned", turn)

        // broadcast turn swapping
        socket.on("turnDone", (move) => {
            io.of("/game").to(room).emit("turnSwap", move, {for: "everyone"})
        })

        // broadcast a checkmate
        socket.on("checkMate", (user) => {
            io.of("/game").to(room).emit("gameOver", user, {for: "everyone"})
        })

        socket.on("disconnect", (evt) => {
            io.of("/game").to(room).emit("opponentLeft", user, {for: "everyone"})
        })
    })
}