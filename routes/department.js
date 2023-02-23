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
        message: 'GET from department was a success',
        data: rows
      });
    });
});

// POST Route for adding new department
department.post('/', ({ body }, res) => {
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [ body[0].name ];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'POST to department was a success',
            data: body
        });
    });
});

module.exports = department;
