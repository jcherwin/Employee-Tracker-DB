const inquirer = require('inquirer');

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
            //Add these in dynamically
        ] 
    },
    {
        type: 'list',
        name: 'add_employee_manager_id',
        message: 'Who is the employee\'s manager?',
        choices: [
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
            //Add these in dynamically
        ] 
    },
    {
        type: 'list',
        name: 'update_employee_role_id',
        message: 'Which role do you want to assign to the selected employee?',
        choices: [
            //Add these in dynamically
        ] 
    },
]

// Takes the generated questions and asks them through the inquirer module
function employeePrompt(e) {

    //Set up a promise that wait to get the questions back before passing them into inquirer
    const ask = new Promise((res, rej) => {
        let questions = employeeQuestions(e);
        res(questions);
    });

    ask
    .then((questions) => {

        inquirer
        .prompt(questions)
        .then((answers) => {

            // Object that destructures the returned answer object to be passed elsewhere
            const prompt =  {
                name: answers.name,
                id: answers.id,
                email: answers.email,
                officeNumber: answers.officeNumber,
                github: answers.github,
                school: answers.school,
            }

            // Sets employee equal to an class object with the relavent information
            let employee = pickEmployee(e, prompt);

            // Each time a set of questions is asked, the new class object is passed to an array
            employeeList.push(employee);

            // Check to see if user wants to continue entering team members, if YES then a new set of appropriate questions is asked
            // if NO, then the recursive loop is exited and the array of class objects is passed to the generateHTML function which
            // prints all the gathered info out to an HTML file
            if(answers.continue != 'Finish building my team'){
                employeePrompt(answers.continue);
            }else{
                console.log("All employees entered!");

                const htmlText = html.generateHTML(employeeList);
                writeToFile(htmlFilePath, htmlText);
            }            
        
        }); // end inquirer

    }); // end ask

} // end function

// Create a function to write HTML file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('Success: HTML File Generated!')
        }
    });
}

// Create a function to initialize app
function init() {

    // Call the employeePrompt function with the string 'Manager' to initialize it, because Manager is the first employee asked for
    employeePrompt('Manager');

}

// Function call to initialize app
init();