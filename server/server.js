const app = require("./app")
const http = require("http").createServer(app)

const port = process.env.PORT || 8000

http.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})