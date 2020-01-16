const express = require("express")
const router = express.Router()
const db = require("../db")
const crypto = require("crypto")

// Get all users
router.get("/", (req, res) => {

    const query = "SELECT * FROM Users"
    db.query(query, (error, results) => {
        if (error) {
            errorHandler(res, 404, error)
            return
        }
        results.rows.forEach(user => {
            delete user.password_hash
        })
        res.status(200).json(results.rows)
    })
})

// Get user with specific id
router.get("/:id", (req, res) => {
    const user_id = req.params.id
    const query = "SELECT * FROM Users WHERE id = $1"
    db.query(query, [user_id], (error, results) => {
        if (error) {
            errorHandler(res, 404, error)
            return
        }
        if (results.rows.length !== 0) {
            delete results.rows[0].password_hash
        }
        res.status(200).json(results.rows[0])
    })
})

// Create a user
router.post("/", (req, res) => {
    const {username, password} = req.body
    const query1 = "SELECT * FROM Users WHERE username = $1"
    db.query(query1, [username], (error, results) => {
        if (error) {
            errorHandler(res, 404, error)
            return
        }
        
        // Check username doesn't already exist
        if (results.rows.length !== 0) {
            errorHandler(res, 400, "Username taken already!")
            return
        }

        const password_hash = setPasswordHash(password)

        const query2 = "INSERT INTO Users(username, password_hash) VALUES ($1, $2)"        
        db.query(query2, [username, password_hash], (error, results) => {
            if (error) {
                errorHandler(res, 404, error)
                return
            }
            res.status(201).json({"message": `User ${username} created successfully`})
        })
    })
})

// Delete user with specific id
router.delete("/:id", (req, res) => {
    const user_id = req.params.id
    const query = "DELETE FROM Users WHERE id = $1"
    db.query(query, [user_id], (error, results) => {
        if (error) {
            errorHandler(res, 404, error)
            return 
        }
        res.status(200).json({"message": `User #${user_id} deleted successfully`})
    })
})

// Hash input password string
const setPasswordHash = (password) => {
    const hash = crypto.createHash('sha256').update(password).digest('hex')
    return hash
};

const errorHandler = (res, statusCode, message) => {
    res.status(statusCode).json({"error": message})
}

module.exports = router