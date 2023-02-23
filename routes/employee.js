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
        message: 'success',
        data: rows
      });
    });
});

// POST Route for adding new employee
employee.post('/', (req, res) => {

});

module.exports = employee;
