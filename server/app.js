require("dotenv").config()
const express = require("express")
const bodyParser = require('body-parser')

const app = express()

const userRouter = require("./api/routes/user_routes")
const authRouter = require("./api/routes/auth_routes")

// JSON body parser
app.use(bodyParser.json())

// CORS enabled
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/user", userRouter)
app.use("/auth", authRouter)

module.exports = app