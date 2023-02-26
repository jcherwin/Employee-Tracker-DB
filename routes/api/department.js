const router = require('express').Router();
const db = require('../../config/dbConnection');

// GET Route for retrieving departments from database
router.get('/', (req, res) => {
    const sql = `SELECT *
    FROM department;`;

    console.log("Outside"); 
  
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
      console.log(response);      
      console.log("Inside");      
    });
});

router.get('/a-z', (req, res) => {
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
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [ body.name ];

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

module.exports = router;
