const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bigshark',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

module.exports = db;