const express = require('express');

// Import our modular routers 
const employeeRouter = require('./employee');
const roleRouter = require('./role');
const departmentRouter = require('./department');

const app = express();

app.use('/employee', employeeRouter);
app.use('/role', roleRouter);
app.use('/department', departmentRouter);

module.exports = app;
