let main = [
    {
        type: 'list',
        name: 'main',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Employees (by manager)',
            'View All Employees (by department)',
            'Add Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Remove Employee',
            'Remove Role',
            'Remove Department',
            'View Department Budgets',
            'Quit'
        ]
    }
]

let addDepartment = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?'
    }
]

let addRole = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?'
    },
    {
        type: 'list',
        name: 'department_id',
        message: 'What department does the role belong to?',
        choices: [/*Add these in dynamically*/] 
    },
]

let addEmployee = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the employee\'s first name?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the employee\'s last name?'
    },
    {
        type: 'list',
        name: 'role_id',
        message: 'What is the employee\'s role?',
        choices: [/*Add these in dynamically*/] 
    },
    {
        type: 'list',
        name: 'manager_id',
        message: 'Who is the employee\'s manager?',
        choices: [/*Add these in dynamically*/] 
    },
]

let updateEmployeeRole = [
    {
        type: 'list',
        name: 'full_name',
        message: 'Which employee\'s role do you want to update?',
        choices: [/*Add these in dynamically*/] 
    },
    {
        type: 'list',
        name: 'role_id',
        message: 'Which role do you want to assign to the selected employee?',
        choices: [/*Add these in dynamically*/] 
    },
]

let updateEmployeeManager = [
    {
        type: 'list',
        name: 'full_name',
        message: 'Which employee\'s manager do you want to update?',
        choices: [/*Add these in dynamically*/] 
    },
    {
        type: 'list',
        name: 'manager_id',
        message: 'Which manager do you want to assign to the selected employee?',
        choices: [/*Add these in dynamically*/] 
    },
]

let removeEmployee = [
    {
        type: 'list',
        name: 'full_name',
        message: 'Which employee do you want to remove?',
        choices: [/*Add these in dynamically*/] 
    },
]

let removeRole = [
    {
        type: 'list',
        name: 'title',
        message: 'Which role do you want to remove?',
        choices: [/*Add these in dynamically*/] 
    },
]

let removeDepartment = [
    {
        type: 'list',
        name: 'name',
        message: 'Which department do you want to remove?',
        choices: [/*Add these in dynamically*/] 
    },
]

let viewDepartmentBudget = [
    {
        type: 'list',
        name: 'name',
        message: 'Which department do you want to view the total budget for?',
        choices: [/*Add these in dynamically*/] 
    },
]

module.exports = 
{ 
    main,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    removeEmployee,
    removeRole,
    removeDepartment,
    viewDepartmentBudget,
};