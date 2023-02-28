const router = require('express').Router();
const db = require('../../config/dbConnection');

// GET Route for retrieving roles from database
router.get('/', (req, res) => {
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
      const response = {
        message: 'GET from role was a success',
        data: rows
      }
      res.json(response);
      console.log(response.message);   
    });
});

// POST Route for adding new role
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
    const params = [ body.title, body.salary, body.department_id ];

    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      const response = {
        message: 'POST to role was a success',
        data: body
      }
      res.json(response);
      console.log(response);   
    });
});

// Delete a role
router.delete('/delete/:id', (req, res) => {
  const sql = `DELETE FROM role WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'Role not found'
      });
    } else {
      const response = {
        message: 'DELETE from role was a success',
        changes: result.affectedRows,
        id: req.params.id
      }
      res.json(response);
      console.log(response);
    }
  });

});

module.exports = router;