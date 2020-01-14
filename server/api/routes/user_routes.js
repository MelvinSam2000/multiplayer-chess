const express = require("express")
const router = express.Router()
const db = require("../db")

// Get all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM Users", (error, results) => {
        if (error) {
            res.status(404).json(error)
            console.log(error)
        }
        res.status(200).json(results.rows)
    })
})

module.exports = router