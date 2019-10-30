const app = require("./app")
const http = require("http").createServer(app)
const io = require("./sockets")

const port = process.env.PORT || 8000

io(http)

http.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})