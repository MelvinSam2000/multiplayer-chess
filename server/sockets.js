let onlineUsers = []
let gameQueue = []
let turn = 0

const errorHandler = (socket, message) => {
    //socket.emit("error", message)
}

module.exports = (server) => {

    const io = require("socket.io")(server)

    // Handle user connecting to server
    io.of("/lobby").on("connection", (socket) => {
        
        // Handle user connected
        const user = socket.request._query["user"]
        onlineUsers.push(user)
        console.log(`${user} is now online!`)

        // handle disconnection
        socket.on("disconnect", (evt) => {
            // remove user from online users list
            onlineUsers = onlineUsers.filter((elem) => {
                return elem != user
            })
            console.log(`${user} has disconnected.`)
        })

        // Return num of online users requested
        socket.on("req_online_num", () => {
            socket.emit("res_online_num", onlineUsers.length)
        })
    })

    // Handle user looking for rival
    io.of("/searching").on("connection", (socket) => {

        // Check user is valid and connected
        const user = socket.request._query["user"]
        if (!onlineUsers.includes(user)) {
            errorHandler(socket, "User not recognized")
            return
        }

        gameQueue.push(user)

        if (gameQueue.length >= 2) {
            let user1 = gameQueue.shift()
            let user2 = gameQueue.shift()
            let players = [user1, user2].sort()
            io.of('/searching').emit('gameStarted', players, {for: "everyone"})
            // decide white and black randomly
            turn = Math.floor(Math.random() * 2)
        }
    })

    // Handle user playing a game
    io.of("/game").on("connection", (socket) => {

        // create room between both users
        const user = socket.handshake.query.user
        const rival = socket.handshake.query.rival
        const players = [user, rival].sort()
        const room = `${players}`
        socket.join(room)

        // assign turns
        io.of("/game").to(room).emit("turnsAssigned", turn)

        // broadcast turn swapping
        socket.on("turnDone", (move) => {
            console.log(move)
            io.of("/game").to(room).emit("turnSwap", move, {for: "everyone"})
        })
        
    })
}