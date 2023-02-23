const inquirer = require('inquirer');
const cTable = require('console.table');
const axios = require('axios');

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
        choices: [/*Add these in dynamically*/] 
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
        choices: [/*Add these in dynamically*/] 
    },
    {
        type: 'list',
        name: 'add_employee_manager_id',
        message: 'Who is the employee\'s manager?',
        choices: [/*Add these in dynamically*/] 
    },
]

let updateEmployeeRoleQuestions = [
    {
        type: 'list',
        name: 'update_employee_name',
        message: 'Which employee\'s role do you want to update?',
        choices: [/*Add these in dynamically*/] 
    },
    {
        type: 'list',
        name: 'update_employee_role_id',
        message: 'Which role do you want to assign to the selected employee?',
        choices: [/*Add these in dynamically*/] 
    },
]

// Get a list of departments from the server
const getRequest = async (param) => 
    await axios({
        method: 'get',
        url: `/api/${param}`,
        baseURL: 'http://localhost:3001',
        responseType: 'application/json'
    })
    .then((response) => { return JSON.parse(response.data) })
    .catch((error) => { console.error('Error:', error) });

const postRequest = async (param,content) => 
    await axios({
        method: 'post',
        url: `/api/${param}`,
        baseURL: 'http://localhost:3001',
        body: content,
        responseType: 'application/json'
    })
    .then((response) => { return JSON.parse(response.data) })
    .catch((error) => { console.error('Error:', error) });

//Abstracted inquirer prompt to handle secondary questions
async function inquirerTemplate(questions,func) {
    await inquirer
    .prompt(questions)
    .then((answers) => {  
        console.log(answers);
        func();
        //call function to POST new data to database
        //mainPrompt();
    })
    .then(() => { mainPrompt() })
}

//Calls query route to get table and then prints the table to console
function printTable(tName) {
    getRequest(tName)
    .then((res) => {
        console.log('\n'); //Adds extra space above table
        console.table(res.data);
     })
    .then(() => { mainPrompt() }) //calls main prompt after table has been printed
}

//Dynamically updates choices from database for questions that need it
function askSecondaryQuestion(questions) {

    switch(questions){
        case 'add-employee':
            //flush choices for good measure
            addEmployeeQuestions[2].choices = [];
            addEmployeeQuestions[3].choices = [];

            getRequest('roles').then((res) => { 
                res.data.forEach((role) => {
                    //add them to question's choices array
                    addEmployeeQuestions[2].choices
                    .push(role.title);
                });
            });
            getRequest('employees').then((res) => { 
                res.data.forEach((employee) => {
                    addEmployeeQuestions[3].choices
                    .push(`${employee.first_name} ${employee.last_name}`);
                });
            }).then(() => { inquirerTemplate(addEmployeeQuestions) });
            break;

        case 'update-employee':
            updateEmployeeRoleQuestions[0].choices = [];
            updateEmployeeRoleQuestions[1].choices = [];

            getRequest('employees').then((res) => { 
                res.data.forEach((employee) => {
                    updateEmployeeRoleQuestions[0].choices
                    .push(`${employee.first_name} ${employee.last_name}`);                    
                });
            });
            getRequest('roles').then((res) => { 
                res.data.forEach((role) => {
                    updateEmployeeRoleQuestions[1].choices
                    .push(role.title);
                });
            }).then(() => { inquirerTemplate(updateEmployeeRoleQuestions); });
            break;

        case 'add-role':
            addRoleQuestions[2].choices = [];

            getRequest('departments')
            .then((res) => { 
                res.data.forEach((department) => {
                    addRoleQuestions[2].choices
                    .push(department.name);
                });
            }).then(() => { 
                inquirerTemplate(addRoleQuestions, function(){
                    console.log("This is a test");
                    postRequest('roles',answers);
                })
            });
            break;

        case 'add-department':
            inquirerTemplate(addDepartmentQuestions);
            break;
    }

}

function secondaryPrompt(choice) {

    switch(choice){
        case 'View All Employees':
            printTable('employees'); //print results from db query  
            break;
        case 'Add Employee':
            askSecondaryQuestion('add-employee'); //updates choices in question and then runs inquirer for the prompt         
            break;
        case 'Update Employee Role':
            askSecondaryQuestion('update-employee');            
            break;
        case 'View All Roles':            
            printTable('roles'); 
            break;
        case 'Add Role':            
            askSecondaryQuestion('add-role');    
            break;
        case 'View All Departments':            
            printTable('departments');
            break;
        case 'Add Department':
            askSecondaryQuestion('add-department');            
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
            secondaryPrompt(choice.main)
        }          
    
    }); 

}

// Create a function to initialize app
function init() {

    console.log(splashText[0]);
    mainPrompt();

}

// Function call to initialize app
init();