const inquirer = require('inquirer');
const cTable = require('console.table');

let splashText = [
    `
    ,-----------------------------------------------------------.
    |                                                           |
    |       _____                _                              |
    |      |  ___|              | |                             |
    |      | |__ _ __ ___  _ __ | | ___  _   _  ___  ___        |
    |      |  __| '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\       |
    |      | |__| | | | | | |_) | | (_) | |_| |  __/  __/       |
    |      \\____/_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|       |
    |                     |_|            |___/                  |
    |      ___  ___                                             |
    |      |  \\/  |                                             |
    |      | .  . | __ _ _ __   __ _  __ _  ___ _ __            |
    |      | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|           |
    |      | |  | | (_| | | | | (_| | (_| |  __/ |              |
    |      \\_|  |_/\\__,_|_| |_|\\__,_|\\__, |\\___|_|              |
    |                                |___/                      |
    |                                                           |
    \`----------------------------------------------------------'
    `
]

let mainQuestions = [
    {
        type: 'list',
        name: 'main',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit'
        ]  
    }
]

let addDepartmentQuestions = [
    {
        type: 'input',
        name: 'add_department_name',
        message: 'What is the name of the department?'
    }
]

let addRoleQuestions = [
    {
        type: 'input',
        name: 'add_role_title',
        message: 'What is the name of the role?'
    },
    {
        type: 'input',
        name: 'add_role_salary',
        message: 'What is the salary of the role?'
    },
    {
        type: 'list',
        name: 'add_role_department_id',
        message: 'What department does the role belong to?',
        choices: [
            'Finance'
            //Add these in dynamically
        ] 
    },
]

let addEmployeeQuestions = [
    {
        type: 'input',
        name: 'add_employee_first_name',
        message: 'What is the employee\'s first name?'
    },
    {
        type: 'input',
        name: 'add_employee_last_name',
        message: 'What is the employee\'s last name?'
    },
    {
        type: 'list',
        name: 'add_employee_role_id',
        message: 'What is the employee\'s role?',
        choices: [
            'Assistant Engineer'
            //Add these in dynamically
        ] 
    },
    {
        type: 'list',
        name: 'add_employee_manager_id',
        message: 'Who is the employee\'s manager?',
        choices: [
            'Jim Smith'
            //Add these in dynamically
        ] 
    },
]

let updateEmployeeRoleQuestions = [
    {
        type: 'list',
        name: 'update_employee',
        message: 'Which employee\'s role do you want to update?',
        choices: [
            'John Doe'
            //Add these in dynamically
        ] 
    },
    {
        type: 'list',
        name: 'update_employee_role_id',
        message: 'Which role do you want to assign to the selected employee?',
        choices: [
            'Sales Manager'
            //Add these in dynamically
        ] 
    },
]

function inquirerTemplate(questions,func) {

    inquirer
    .prompt(questions)
    .then((choice) => {  
        console.log(choice)
        mainPrompt();
    });

}

function secondaryPrompt(choice) {

    switch(choice){
        case 'View All Employees':
            //function that does a query route to get employees
            break;
        case 'View All Roles':
            //function that does a query route to get roles
            break;
        case 'View All Departments':
            //function that does a query route to get departments
            break;
        case 'Add Employee':
            inquirerTemplate(addEmployeeQuestions) //add function to call that posts new data to employee table
            break;
        case 'Add Role':
            inquirerTemplate(addRoleQuestions) //add function to call that posts new data to role table
            break;
        case 'Add Department':
            inquirerTemplate(addDepartmentQuestions) //add function to call that posts new data to department table
            break;
        case 'Update Employee Role':
            inquirerTemplate(updateEmployeeRoleQuestions) //add function to call that queries employees and roles and then posts new data to employee table
            break;
    }

}

// Takes the generated questions and asks them through the inquirer module
function mainPrompt() {

    inquirer
    .prompt(mainQuestions)
    .then((choice) => {        

        if(choice.main === 'Quit'){
            console.log("Exiting program");
            process.exit();
        }else{
            //console.log(choice);
            //All choice logic goes here

            secondaryPrompt(choice.main)
        }          
    
    }); // end inquirer

} // end function

// Create a function to initialize app
function init() {

    console.log(splashText[0]);
    mainPrompt();

}

// Function call to initialize app
init();