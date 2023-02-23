const department = require('express').Router();
const db = require('./dbConnection');

// GET Route for retrieving departments from database
department.get('/', (req, res) => {
    const sql = `SELECT *
    FROM department
    ORDER BY department.name;`;
  
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

// POST Route for adding new department
department.post('/', (req, res) => {

});

module.exports = department;
