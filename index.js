const inquirer = require('inquirer');
const cTable = require('console.table');
const axios = require('axios');
const questions = require('./questions');

const TABLE_ROLE = 'role';
const TABLE_DEPARTMENT = 'department';
const TABLE_EMPLOYEE = 'employee';
const TABLE_DEPARTMENT_BY_NAME = 'department/sort-by/name';
const TABLE_DEPARTMENT_BUDGET = 'department/budget';
const TABLE_EMPLOYEE_FULLNAME = 'employee/full-name';
const TABLE_EMPLOYEE_MANAGER = 'employee/manager';
const TABLE_EMPLOYEE_BY_MANAGER = 'employee/sort-by/manager';
const TABLE_EMPLOYEE_BY_DEPARTMENT = 'employee/sort-by/department';

let departmentData = {};
let roleData = {};
let employeeData = {};
let answers;

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

//Performs request to the database and returns the reponse
async function dbRequest (type, param, content)
{
    const request = 
    {
        method: type,
        url: `/api/${param}`,
        baseURL: 'http://localhost:3001',
        responseType: 'application/json'
    }

    if(content){ request.data = content }

    const response = await axios(request);
    const json = await response.data;

    return JSON.parse(json);
}

//Abstracted inquirer prompt to handle secondary questions
async function inquirerTemplate(questions)
{
    const prompt = await inquirer.prompt(questions);
    return prompt;
}

async function storeTableAsObject(tName)
{    
    //Get data from the required table
    const response  = await dbRequest('get', tName);
    const data = await response.data;

    //Assigns the data to a local object for updating id values later
    switch(tName)
    {
        case TABLE_DEPARTMENT:
        case TABLE_DEPARTMENT_BY_NAME:
            departmentData = data; break;
        case TABLE_ROLE:
            roleData = data; break;
        case TABLE_EMPLOYEE:
        case TABLE_EMPLOYEE_FULLNAME:
        case TABLE_EMPLOYEE_MANAGER:
            employeeData = data; break;
    }

    //Returns data for use with an assigned variable
    return data;
}


//Queries tables and then modifies choices in given array with table data
//Takes: Table (string) you want to access, Key (string) for values you want to add to choices array, Choices (array) you want to update
async function updateQuestionChoices(tName, key, array)
{
    //Gives user the ability to select None for managers
    if(tName == 'employee/manager'){ array.push('None') }

    //Get data from the required table as local object 
    data = await storeTableAsObject(tName);

    //Go through each row and assign the needed value to the provided question choices array
    data.forEach((item) => { array.push(item[key]) });
}

function clearQuestionChoices()
{
    questions.addRole[2].choices = [];
    questions.addEmployee[2].choices = [];
    questions.addEmployee[3].choices = [];
    questions.updateEmployeeRole[0].choices = [];
    questions.updateEmployeeRole[1].choices = [];
    questions.updateEmployeeManager[0].choices = [];
    questions.updateEmployeeManager[1].choices = [];
    questions.viewDepartmentBudget[0].choices = [];
}

function updateId(answers, searchObj, updatedKey, searchKey){
    searchObj.forEach((item) => 
    {
        if(answers[updatedKey] == item[searchKey]){ answers[updatedKey] = item.id }
    });
}

// Sanitized answers from inquirer to match correct data type to be sent to db
function sanitizeForDb(type, tName, answers)
{
    if(type == 'post')
    {
        if(tName == TABLE_ROLE)
        {
            updateId(answers, departmentData, 'department_id', 'name');
        }
        else if(tName == TABLE_EMPLOYEE)
        {
            updateId(answers, roleData, 'role_id', 'title');
            updateId(answers, employeeData, 'manager_id', 'full_name');
        }
    }
    else if(type == 'put' || type == 'delete')
    {
        if(tName == TABLE_EMPLOYEE)
        {
            updateId(answers, employeeData, 'full_name', 'full_name');
            answers.id = answers.full_name;

            if(answers.role_id)
            {
                updateId(answers, roleData, 'role_id', 'title');
            }
            if(answers.manager_id)
            {
                updateId(answers, employeeData, 'manager_id', 'full_name');
            }
        }
        if(tName == TABLE_ROLE)
        {
            updateId(answers, roleData, 'title', 'title');
            answers.id = answers.title;
        }
        if(tName == TABLE_DEPARTMENT)
        {
            updateId(answers, departmentData, 'name', 'name');
            answers.id = answers.name;
        }
    }
    return answers;
}

// Accepts table name and answers from inquirer to be sanitized and then sent to db, then prints result
async function queryAnswersToDb(type, tName, answers)
{
    answers = await sanitizeForDb(type, tName, answers);
    //console.log(answers);
    
    if(type == 'post')
    {
        dbRequest(type, tName, answers);

        if(tName == TABLE_DEPARTMENT)
        {
            console.log(`Added ${answers.name} to the database`);
        }
        else if(tName == TABLE_ROLE)
        {
            console.log(`Added ${answers.title} to the database`);
        }
        else if(tName == TABLE_EMPLOYEE)
        {
            console.log(`Added ${answers.first_name} ${answers.last_name} to the database`);
        }
    }
    else if(type == 'put')
    {
        if(tName == TABLE_EMPLOYEE && answers.role_id)
        {
            let route = `${TABLE_EMPLOYEE}/role_id/${answers.id}`;
            dbRequest(type, route, answers);
            console.log(`Updated employee's role`);
        }
        if(tName == TABLE_EMPLOYEE && (answers.manager_id || answers.manager_id == null) && !answers.role_id)
        {
            let route = `${TABLE_EMPLOYEE}/manager_id/${answers.id}`;
            dbRequest(type, route, answers);
            console.log(`Updated employee's manager`);
        }
    }
    else if(type == 'delete')
    {
        if(tName == TABLE_EMPLOYEE)
        {
            let route = `${TABLE_EMPLOYEE}/delete/${answers.id}`;
            dbRequest(type, route, answers);
            console.log(`Removed employee from db`);
        }
        if(tName == TABLE_ROLE)
        {
            let route = `${TABLE_ROLE}/delete/${answers.id}`;
            dbRequest(type, route, answers);
            console.log(`Removed role from db`);
        }
        if(tName == TABLE_DEPARTMENT)
        {
            let route = `${TABLE_DEPARTMENT}/delete/${answers.id}`;
            dbRequest(type, route, answers);
            console.log(`Removed department from db`);
        }
    }
}

//Dynamically updates choices from database for questions that need it
async function askSecondaryQuestion(question)
{
    clearQuestionChoices();

    switch(question)
    {
        case 'add-employee':
            //Dynamically updates question choices from db data
            await updateQuestionChoices(TABLE_ROLE, 'title', questions.addEmployee[2].choices);
            await updateQuestionChoices(TABLE_EMPLOYEE_MANAGER, 'full_name', questions.addEmployee[3].choices);

            //Retrieve answers from inquirer prompt
            answers = await inquirerTemplate(questions.addEmployee);
            if(answers.manager_id == 'None'){ answers.manager_id = null };

            //Send answers to the database and log that its been done
            await queryAnswersToDb('post', TABLE_EMPLOYEE, answers);
            break;
        
        case 'update-employee-role': 
            await updateQuestionChoices(TABLE_EMPLOYEE_FULLNAME, 'full_name', questions.updateEmployeeRole[0].choices);
            await updateQuestionChoices(TABLE_ROLE, 'title', questions.updateEmployeeRole[1].choices);
            answers = await inquirerTemplate(questions.updateEmployeeRole);
            await queryAnswersToDb('put', TABLE_EMPLOYEE, answers);
            break;

        case 'update-employee-manager': 
            await updateQuestionChoices(TABLE_EMPLOYEE_FULLNAME, 'full_name', questions.updateEmployeeManager[0].choices);
            await updateQuestionChoices(TABLE_EMPLOYEE_MANAGER, 'full_name', questions.updateEmployeeManager[1].choices);
            answers = await inquirerTemplate(questions.updateEmployeeManager);
            if(answers.manager_id == 'None'){ answers.manager_id = null };
            await queryAnswersToDb('put', TABLE_EMPLOYEE, answers);
            break;

        case 'add-role':           
            await updateQuestionChoices(TABLE_DEPARTMENT_BY_NAME, 'name', questions.addRole[2].choices);
            answers = await inquirerTemplate(questions.addRole);
            await queryAnswersToDb('post', TABLE_ROLE, answers);
            break;

        case 'add-department':
            answers = await inquirerTemplate(questions.addDepartment);
            await queryAnswersToDb('post', TABLE_DEPARTMENT, answers);
            break;

        case 'remove-employee':
            await updateQuestionChoices(TABLE_EMPLOYEE_FULLNAME, 'full_name', questions.removeEmployee[0].choices);
            answers = await inquirerTemplate(questions.removeEmployee);
            await queryAnswersToDb('delete', TABLE_EMPLOYEE, answers);
            break;

        case 'remove-role':
            await updateQuestionChoices(TABLE_ROLE, 'title', questions.removeRole[0].choices);
            answers = await inquirerTemplate(questions.removeRole);
            await queryAnswersToDb('delete', TABLE_ROLE, answers);
            break;

        case 'remove-department':
            await updateQuestionChoices(TABLE_DEPARTMENT_BY_NAME, 'name', questions.removeDepartment[0].choices);
            answers = await inquirerTemplate(questions.removeDepartment);
            await queryAnswersToDb('delete', TABLE_DEPARTMENT, answers);
            break;

        case 'view-department-budget':
            await updateQuestionChoices(TABLE_DEPARTMENT_BY_NAME, 'name', questions.viewDepartmentBudget[0].choices);
            answers = await inquirerTemplate(questions.viewDepartmentBudget);
            answers = await sanitizeForDb('put', TABLE_DEPARTMENT, answers);

            let route = `${TABLE_DEPARTMENT_BUDGET}/${answers.id}`;
            await printTable(route);
            break;
    }
    mainPrompt();  // Calls main prompt after secondary questions has been asked
}

// Calls query route to get table and then prints the table to console
async function printTable(tName)
{
    data = await storeTableAsObject(tName) //Stores tables data as local object

    console.log('\n'); //Adds extra space above table
    console.table(data); //Uses npm package console.table to print out table data

    if(tName.split('/')[1] != 'budget')
    {
        mainPrompt(); //Calls main prompt after table has been printed
    }    
}

function mainPromptSwitch(choice)
{
    let lastIndex = questions.main[0].choices.length - 1;

    if(choice == questions.main[0].choices[lastIndex]){ console.log("Exiting program"); process.exit(); } //Quit
    else if(choice == questions.main[0].choices[0]){ printTable(TABLE_EMPLOYEE) }                         //View All Employees
    else if(choice == questions.main[0].choices[1]){ printTable(TABLE_EMPLOYEE_BY_MANAGER) }              //View All Employees (by manager)
    else if(choice == questions.main[0].choices[2]){ printTable(TABLE_EMPLOYEE_BY_DEPARTMENT) }           //View All Employees (by department)
    else if(choice == questions.main[0].choices[3]){ askSecondaryQuestion('add-employee') }               //Add Employee
    else if(choice == questions.main[0].choices[4]){ askSecondaryQuestion('update-employee-role') }       //Update Employee Role
    else if(choice == questions.main[0].choices[5]){ askSecondaryQuestion('update-employee-manager') }    //Update Employee Manager
    else if(choice == questions.main[0].choices[6]){ printTable(TABLE_ROLE) }                             //View All Roles 
    else if(choice == questions.main[0].choices[7]){ askSecondaryQuestion('add-role') }                   //Add Role
    else if(choice == questions.main[0].choices[8]){ printTable(TABLE_DEPARTMENT_BY_NAME) }               //View All Departments
    else if(choice == questions.main[0].choices[9]){ askSecondaryQuestion('add-department') }             //Add Department
    else if(choice == questions.main[0].choices[10]){ askSecondaryQuestion('remove-employee') }           //Remove Employee
    else if(choice == questions.main[0].choices[11]){ askSecondaryQuestion('remove-role') }               //Remove Role
    else if(choice == questions.main[0].choices[12]){ askSecondaryQuestion('remove-department') }         //Remove Department
    else if(choice == questions.main[0].choices[13]){ askSecondaryQuestion('view-department-budget') }    //View Department Budgets
}

// Takes the generated questions and asks them through the inquirer module
function mainPrompt() 
{
    inquirer
    .prompt(questions.main)
    .then((choice) => 
    {
        mainPromptSwitch(choice.main);
    });
}

// Create a function to initialize app
function init()
{
    console.log(splashText[0]);
    mainPrompt();
}

// Function call to initialize app
init();