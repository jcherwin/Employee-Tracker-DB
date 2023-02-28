const router = require('express').Router();
const db = require('../../config/dbConnection');

// GET Route for retrieving departments from database
router.get(['/', '/sort-by/name'], (req, res) => {
  let sql = `SELECT * FROM department`;

  if(req.path == '/sort-by/name'){ sql += ` ORDER BY department.name` }
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const response = {
      message: 'GET from department was a success',
      data: rows
    }
    res.json(response);
    console.log(response.message);           
  });

});

// GET Route for retrieving departments from database
router.get('/budget/:id', (req, res) => {
  let sql = `SELECT
  department.id as id,
  department.name as department,
  SUM(role.salary) as budget
  FROM employee
  LEFT JOIN role
  ON employee.role_id = role.id
  LEFT JOIN department
  ON role.department_id = department.id
  WHERE department.id = ?`;

  const params = [req.params.id];  
  
  db.query(sql, params, (err, rows) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else {
      const response = {
        message: 'GET from department was a success',
        data: rows
      }
      res.json(response);
      console.log(response.message);
    }
  });

});

// POST Route for adding new department
router.post('/', ({ body }, res) => {
  const sql = `INSERT INTO department (name)
  VALUES (?)`;
  const params = [ body.name ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const response = {
      message: 'POST to department was a success',
      data: body
    }
    res.json(response);
    console.log(response);   
  });

});

// Delete a department
router.delete('/delete/:id', (req, res) => {
  const sql = `DELETE FROM department WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'Department not found'
      });
    } else {
      const response = {
        message: 'DELETE from department was a success',
        changes: result.affectedRows,
        id: req.params.id
      }
      res.json(response);
      console.log(response);
    }
  });

});

module.exports = router;