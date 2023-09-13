const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cTable = require("console.table");

const db = mysql2.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'business_db'
},
    console.log(`Connected to the database.`)
)

const initQuestions = [
    {
        type: 'list',
        name: 'userAction',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    }
];

const viewDepartments = () => {
    let query = 'SELECT * FROM departments'
    db.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(res);
    })
}

const viewRoles = () => {
    let query = 'SELECT * FROM roles'
    db.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(res);
    })
}

const viewEmployees = () => {
    let query = 'SELECT * FROM employees'
    db.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(res);
    })
}

const init = () => {
    inquirer.prompt(initQuestions).then((response) => {
        console.log(response)
        switch (response.userAction) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':

                break;
            case 'Add a role':

                break;
            case 'Add an employy':

                break;
            case 'Update an employee role':

                break;
        }
    })
        .catch(err => {
            console.log('Error on promise ->', err);
        })
}

// initialize the app
init();