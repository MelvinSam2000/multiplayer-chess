require("dotenv").config()
const express = require("express")
const bodyParser = require('body-parser')

const app = express()

const userRouter = require("./api/routes/user_routes")

app.use(bodyParser.json())

app.use("/user", userRouter)

module.exports = app