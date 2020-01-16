require("dotenv").config()
const express = require("express")
const bodyParser = require('body-parser')

const app = express()

const userRouter = require("./api/routes/user_routes")
const authRouter = require("./api/routes/auth_routes")

app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.json({"message": "Testing..."})
})

app.use("/user", userRouter)
app.use("/auth", authRouter)

module.exports = app