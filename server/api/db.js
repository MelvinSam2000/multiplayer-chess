const Pool = require('pg').Pool

const DB_URI = process.env.DB_URI
const pool = new Pool({
    connectionString: DB_URI,
    ssl: true
})

module.exports = pool