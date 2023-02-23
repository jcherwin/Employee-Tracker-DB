const employee = require('express').Router();
const db = require('./dbConnection');

// GET Route for retrieving employees from database
employee.get('/', (req, res) => {
    const sql = `SELECT 
    employee.id AS id,
    employee.first_name AS first_name,
    employee.last_name AS last_name,
    role.title AS title,
    department.name AS department,
    role.salary AS salary,
    CONCAT(e2.first_name, ' ', e2.last_name) AS manager
    FROM employee 
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee e2
    ON employee.manager_id = e2.id;`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      res.json({
        message: 'GET from employee was a success',
        data: rows
      });
    });
});

// POST Route for adding new employee
employee.post('/', ({ body }, res) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    const params = [ body[0].first_name, body[0].last_name, body[0].role_id, body[0].manager_id ];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'POST to employee was a success',
            data: body
        });
    });
});

module.exports = employee;
