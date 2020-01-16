const Pool = require('pg').Pool

const DB_URI = process.env.DATABASE_URL
const pool = new Pool({
    connectionString: DB_URI,
    ssl: true
})

module.exports = pool