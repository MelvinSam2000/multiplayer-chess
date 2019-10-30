module.exports = (server) => {
    // Start socket
    const io = require("socket.io")(server)

    // Listen for connections
    io.of("/lobby").on("connection", (socket) => {
        console.log("client connected!")
    })
}