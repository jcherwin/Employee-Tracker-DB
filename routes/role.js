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
        message: 'GET from role was a success',
        data: rows
      });
    });
});

// POST Route for adding new role
role.post('/', ({ body }, res) => {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
    const params = [ body[0].title, body[0].salary, body[0].department_id ];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'POST to role was a success',
            data: body
        });
    });
});

module.exports = role;
