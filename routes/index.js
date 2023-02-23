const express = require('express');

// Import our modular routers 
const employeeRouter = require('./employee');
const roleRouter = require('./role');
const departmentRouter = require('./department');

const app = express();

app.use('/employees', employeeRouter);
app.use('/roles', roleRouter);
app.use('/departments', departmentRouter);

module.exports = app;
