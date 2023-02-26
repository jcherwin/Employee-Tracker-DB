const inquirer = require('inquirer');
const cTable = require('console.table');
const axios = require('axios');

const TABLE_ROLE = 'role';
const TABLE_DEPARTMENT = 'department';
const TABLE_EMPLOYEE = 'employee';
const TABLE_DEPARTMENT_SORTED = 'department/a-z';
const TABLE_EMPLOYEE_FULLNAME = 'employee/full-name';

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
        name: 'name',
        message: 'What is the name of the department?'
    }
]

let addRoleQuestions = [
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

let addEmployeeQuestions = [
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

let updateEmployeeRoleQuestions = [
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

//Performs request to the database and returns the reponse
async function dbRequest (type, param, content) {
    const request = {
        method: type,
        url: `/api/${param}`,
        baseURL: 'http://localhost:3001',
        responseType: 'application/json'
    }    
    if(content){ request.data = content }

    //console.log(request);

    const response = await axios(request);
    const json = await response.data;

    return JSON.parse(json);
}

//Abstracted inquirer prompt to handle secondary questions
async function inquirerTemplate(questions) {
    const prompt = await inquirer.prompt(questions);
    return prompt;
}

async function storeTableAsObject(tName){    
    //Get data from the required table
    const response  = await dbRequest('get', tName);
    const data = await response.data;

    //Assigns the data to a local object for updating id values later
    switch(tName)
    {
        case TABLE_DEPARTMENT:
        case TABLE_DEPARTMENT_SORTED:
            departmentData = data; break;
        case TABLE_ROLE:
            roleData = data; break;
        case TABLE_EMPLOYEE:
        case TABLE_EMPLOYEE_FULLNAME:
            employeeData = data; break;
    }

    //Returns data for use with an assigned variable
    return data;
}


//Queries tables and then modifies choices in given array with table data
//Takes: Table (string) you want to access, Key (string) for values you want to add to choices array, Choices (array) you want to update
async function updateQuestionChoices(tName, key, array) {

    //console.log(tName);
    //console.log(key);
    //console.log(array);

    //Get data from the required table as local object 
    data = await storeTableAsObject(tName);

    //console.log(data);

    //Go through each row and assign the needed value to the provided question choices array
    data.forEach((item) => { array.push(item[key]) });
}

function clearQuestionChoices(){
    addEmployeeQuestions[2].choices = [];
    addEmployeeQuestions[3].choices = [];
    updateEmployeeRoleQuestions[0].choices = [];
    updateEmployeeRoleQuestions[1].choices = [];
    addRoleQuestions[2].choices = [];
}

// Sanitized answers from inquirer to match correct data type to be sent to db
async function sanitizeForDb(type, tName, answers) {
    if(type == 'post'){
        switch(tName){ //Employee and Role are the only tables that need sanitized values
            case TABLE_ROLE:
                departmentData.forEach((department) => {
                    if(answers.department_id == department.name){ answers.department_id = department.id }
                });
                break;
            case TABLE_EMPLOYEE:
                roleData.forEach((role) => {
                    if(answers.role_id == role.title){ answers.role_id = role.id }
                });
                employeeData.forEach((employee) => {
                    if(answers.manager_id == employee.full_name){ answers.manager_id = employee.id }
                });
                break;
            default: break;
        }
    }else if(type == 'put'){
        switch(tName){
            case TABLE_EMPLOYEE:
                employeeData.forEach((employee) => {
                    if(answers.full_name == employee.full_name){ answers.id = employee.id }
                });
                roleData.forEach((role) => {
                    if(answers.role_id == role.title){ answers.role_id = role.id }
                });
                break;
            default: break;   
        }
    }
    

    return answers;
}

// Accepts table name and answers from inquirer to be sanitized and then sent to db, then prints result
async function sendAnswersToDb(type, tName, answers) {
    answers =  await sanitizeForDb(type, tName, answers);
    //console.log(answers);
    
    if(type == 'post'){
        dbRequest(type, tName, answers);

        switch(tName) {
            case TABLE_DEPARTMENT:
                console.log(`Added ${answers.name} to the database`); break;
            case TABLE_ROLE:
                console.log(`Added ${answers.title} to the database`); break;
            case TABLE_EMPLOYEE:
                console.log(`Added ${answers.first_name} ${answers.last_name} to the database`); break;
        }
    }else if(type == 'put'){       

        switch(tName) {
            case TABLE_EMPLOYEE:
                let route = `${TABLE_EMPLOYEE}/${answers.id}`;
                dbRequest(type, route, answers);
                console.log(`Updated employee's role`); break;
        }
    }
}

//Dynamically updates choices from database for questions that need it
async function askSecondaryQuestion(questions) {
    clearQuestionChoices();

    switch(questions){
        case 'add-employee':
            //Dynamically updates question choices from db data
            await updateQuestionChoices(TABLE_ROLE, 'title', addEmployeeQuestions[2].choices);
            await updateQuestionChoices(TABLE_EMPLOYEE_FULLNAME, 'full_name', addEmployeeQuestions[3].choices);

            //Retrieve answers from inquirer prompt
            answers = await inquirerTemplate(addEmployeeQuestions);

            //Send answers to the database and log that its been done
            await sendAnswersToDb('post', TABLE_EMPLOYEE, answers);
            break;
        
        case 'update-employee': 
            await updateQuestionChoices(TABLE_EMPLOYEE_FULLNAME, 'full_name', updateEmployeeRoleQuestions[0].choices);
            await updateQuestionChoices(TABLE_ROLE, 'title', updateEmployeeRoleQuestions[1].choices);
            answers = await inquirerTemplate(updateEmployeeRoleQuestions);
            await sendAnswersToDb('put', TABLE_EMPLOYEE, answers);
            break;

        case 'add-role':           
            await updateQuestionChoices(TABLE_DEPARTMENT_SORTED, 'name', addRoleQuestions[2].choices);
            answers = await inquirerTemplate(addRoleQuestions);
            await sendAnswersToDb('post', TABLE_ROLE, answers);
            break;

        case 'add-department':
            answers = await inquirerTemplate(addDepartmentQuestions);
            await sendAnswersToDb('post', TABLE_DEPARTMENT, answers);
            break;
    }

    mainPrompt();  // Calls main prompt after secondary questions has been asked

}

// Calls query route to get table and then prints the table to console
async function printTable(tName) {    
    data = await storeTableAsObject(tName); //Stores tables data as local object

    console.log('\n'); //Adds extra space above table
    console.table(data); //Uses npm package console.table to print out table data

    mainPrompt(); //Calls main prompt after table has been printed
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

            switch(choice.main){
                case 'View All Employees':
                    // Print results from db query
                    printTable(TABLE_EMPLOYEE); break;                    
                case 'Add Employee':
                    // Updates choices in question and then runs inquirer for the prompt
                    askSecondaryQuestion('add-employee'); break;
                case 'Update Employee Role':
                    askSecondaryQuestion('update-employee'); break;
                case 'View All Roles':            
                    printTable(TABLE_ROLE); break;
                case 'Add Role':            
                    askSecondaryQuestion('add-role'); break;
                case 'View All Departments':            
                    printTable(TABLE_DEPARTMENT_SORTED); break;
                case 'Add Department':
                    askSecondaryQuestion('add-department'); break;
                    
            } //end switch

        } //end if

    }); //end inquirer

} //end function

// Create a function to initialize app
function init() {

    //console.log(splashText[0]);
    mainPrompt();
    //dbRequest('post', TABLE_EMPLOYEE, []);
    //let data = await storeTableAsObject(TABLE_EMPLOYEE);
    //console.log(data);
    //console.log(employeeData);


}

// Function call to initialize app
init();