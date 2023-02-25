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
      res.json({
        message: 'GET from role was a success',
        data: rows
      });
    });
});

// POST Route for adding new role
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
    const params = [ body.title, body.salary, body.department_id ];

    console.log(body);
    console.log(params);

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

module.exports = router;
