const router = require('express').Router();

// Import our modular routers 
const employeeRouter = require('./employee');
const roleRouter = require('./role');
const departmentRouter = require('./department');

//const app = express();

router.use('/employee', employeeRouter);
router.use('/role', roleRouter);
router.use('/department', departmentRouter);

module.exports = router;
