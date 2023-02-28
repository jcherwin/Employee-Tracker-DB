const router = require('express').Router();
const db = require('../../config/dbConnection');

const select_primary = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name,
role.title AS title, department.name AS department, role.salary AS salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager
FROM employee 
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee e2 ON employee.manager_id = e2.id`;

const select_secondary = `SELECT employee.id AS id,
CONCAT(employee.first_name, ' ', employee.last_name) AS full_name
FROM employee`;

// GET Route for retrieving employees from database
router.get(['/', '/sort-by/manager', '/sort-by/department', '/full-name', '/manager'], (req, res) => {
  let sql = select_primary;

  if(req.path == '/sort-by/manager'){ sql = select_primary + ` ORDER BY manager` }
  else if(req.path == 'sort-by/department'){ sql = select_primary + ` ORDER BY department` }
  else if(req.path == '/full-name' || req.path == '/manager'){ sql = select_secondary }

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const response = {
      message: 'GET from employee was a success',
      data: rows
    }
    res.json(response);
    console.log(response.message);   
  });

});

// POST Route for adding new employee
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const params = [ body.first_name, body.last_name, body.role_id, body.manager_id ];

    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      const response = {
        message: 'POST to employee was a success',
        data: body
      }
      res.json(response);
      console.log(response);   
    });
});

// PUT update an employee
router.put(['/role_id/:id', '/manager_id/:id'], (req, res) => {
  let col;
  let params;

  if(req.path.split('/')[1] == 'role_id')
  {
    col = 'role_id';
    params = [req.body.role_id, req.params.id];
  }
  else if(req.path.split('/')[1] == 'manager_id')
  {
    col = 'manager_id';
    params = [req.body.manager_id, req.params.id]
  }

  const sql = `UPDATE employee SET ${col} = ? WHERE id = ?`;  
  
  db.query(sql, params, (err, result) => 
  {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      const response = {
        message: 'PUT to employee was a success',
        data: req.body,
        changes: result.affectedRows
      }
      res.json(response);
      console.log(response);      
    }
  });

});

// Delete an employee
router.delete('/delete/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'Employee not found'
      });
    } else {
      const response = {
        message: 'DELETE from employee was a success',
        changes: result.affectedRows,
        id: req.params.id
      }
      res.json(response);
      console.log(response);
    }
  });

});

module.exports = router;