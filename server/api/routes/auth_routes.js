const express = require("express")
const router = express.Router()
const db = require("../db")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const JWT_KEY = process.env.JWT_KEY

router.post("/login", (req, res) => {
    const {username, password} = req.body
    const query = "SELECT * FROM Users WHERE username = $1"
    db.query(query, [username], (error, results) => {
        if (error) {
            errorHandler(res, 400, error)
            return
        }
        if (results.rows.length === 0) {
            errorHandler(res, 404, "Username does not exist!")
            return
        }
        const user = results.rows[0]
        const valid = checkPassword(password, user.password_hash)
        if (!valid) {
            errorHandler(res, 400, "Incorrect password!")
            return
        }
        // JWT token generate
        const token = jwt.sign({
            id: user.id
        }, JWT_KEY, {
            expiresIn: "1h"
        })
        res.status(200).json({"token": token})
    })
})

// Check password is valid
const checkPassword = (passwordInput, passwordHash) => {
    const hash = crypto.createHash('sha256').update(passwordInput).digest('hex')
    return passwordHash === hash
}

const errorHandler = (res, statusCode, message) => {
    res.status(statusCode).json({"error": message})
}

module.exports = router