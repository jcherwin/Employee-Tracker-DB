const role = require('express').Router();
const db = require('./dbConnection');

// GET Route for retrieving roles from database
role.get('/', (req, res) => {
    const sql = `SELECT
    role.id AS id,
    role.title AS title,
    department.name AS department,
    role.salary AS salary
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id;`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
});

// POST Route for adding new role
role.post('/', (req, res) => {

});

module.exports = role;
