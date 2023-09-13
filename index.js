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
    let query = `
    SELECT roles.id AS role_id,
           roles.title AS job_title,
           roles.salary AS role_salary,
           departments.name AS department_name
    FROM roles
    JOIN departments ON roles.department_id = departments.id;
`;

    db.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(res);
    })
}

const viewEmployees = () => {
    let query = `
    SELECT employees.id AS employees_id,
           employees.first_name AS first_name,
           employees.last_name AS last_name,
           employees.manager_id AS manager_id,
           roles.title AS job_title,
           roles.salary AS salary,
           departments.name AS department
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id;
`;

    db.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(res);
    })
}

const departmentQuestions = [
    {
        type: 'input',
        name: 'newDepartment',
        message: 'What is the new department called'
    }
]

const addDepartment = (name) => {
    let query = 'INSERT INTO departments (name) VALUES (?)'
    const params = [name];
    db.query(query, params, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(name + 'successfully added');
    })
}

const roleQuestions = [
    {
        type: 'input',
        name: 'newRole',
        message: 'What is the new role called'
    },
    {
        type: 'input',
        name: 'newSalary',
        message: 'What is the salary of this new role',
        validate: (salary) => {
            if (Number.isInteger(salary)) {
                return 'please use an integer'
            } else {
                return true;
            }
        }
    },
]

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
                inquirer.prompt(departmentQuestions).then((response) => {
                    addDepartment(response.newDepartment);
                });
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