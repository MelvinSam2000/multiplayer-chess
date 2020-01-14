require("dotenv").config()
const express = require("express")
const app = express()

const userRouter = require("./api/routes/user_routes")

app.use("/user", userRouter)

module.exports = app