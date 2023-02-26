const router = require('express').Router();
const db = require('../../config/dbConnection');

// GET Route for retrieving employees from database
router.get('/', (req, res) => {
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
    ON employee.manager_id = e2.id`;
  
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

router.get('/full-name', (req, res) => {
  const sql = `SELECT
  employee.id AS id,
  CONCAT(employee.first_name, ' ', employee.last_name) AS full_name
  FROM employee`;

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
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    const params = [ body.first_name, body.last_name, body.role_id, body.manager_id ];

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

// PUT update an employee
router.put('/:id', (req, res) => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];
      
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Employee not found'
        });
      } else {
        res.json({
          message: 'PUT to employee was a success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
});


module.exports = router;
