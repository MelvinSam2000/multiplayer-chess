const express = require("express")

const app = express()

// TODO: Remove this later
app.get("/", (req, res) => {
    res.json({"message": "Hello World"})
})

module.exports = app