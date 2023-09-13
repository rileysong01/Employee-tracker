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
                return 'Please use an integer';
            } else {
                return true;
            }
        }
    },
    {
        type: 'input',
        name: 'department',
        message: 'What is the department id for this role?',
        validate: (departmentId) => {
            if (Number.isInteger(departmentId)) {
                return 'Please use an integer';
            } else {
                return true;
            }
        }
    }
];

const addRoles = (title, salary, department_id) => {
    let query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)'
    const params = [title, salary, department_id];
    db.query(query, params, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(title + ' successfully added');
    })
}

const employeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: 'What is the employees first name?'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'What is the employees last name?'
    },
    {
        type: 'input',
        name: 'role',
        message: 'What is the employees role id?',
        validate: (role) => {
            if (Number.isInteger(role)) {
                return 'Please use an integer';
            } else {
                return true;
            }
        }
    },
    {
        type: 'input',
        name: 'manager',
        message: 'What is the employees manager id?',
        validate: (manager) => {
            if (Number.isInteger(manager)) {
                return 'Please use an integer';
            } else {
                return true;
            }
        }
    },
]

const addEmployee = (first_name, last_name, role_id, manager_id) => {
    let query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?,?)'
    const params = [first_name, last_name, role_id, manager_id];
    db.query(query, params, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(first_name + ' ' + last_name + ' successfully added');
    })
}

const updateEmployee = (role_id, id) => {
    let query = 'UPDATE employees SET role_id = ? WHERE id = ?'
    const params = [role_id, id]
    db.query(query, params, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(id + 's role has been successfully updated to' + role_id);
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
                inquirer.prompt(departmentQuestions).then((response) => {
                    addDepartment(response.newDepartment);
                });
                break;
            case 'Add a role':
                inquirer.prompt(roleQuestions).then((response) => {
                    addRoles(response.newRole, response.newSalary, response.department)
                });
                break;
            case 'Add an employee':
                inquirer.prompt(employeeQuestions).then((response) => {
                    addEmployee(response.firstName,response.lastName,response.role,response.manager);
                });
                break;
            case 'Update an employee role':
                const employeeList = [];
                db.query('SELECT id FROM employees', (err, results) => {
                    if (err) {
                      console.error('Error executing query:', err);
                    } else {
                      employeeList.push(...results.map(row => row.id));
                      inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Select the employee ID you would like to udpate',
                            choices: employeeList
                        },
                        {
                            type: 'input',
                            name: 'newRole',
                            message: 'What is the employees new role ID?',
                            validate: (newRole) => {
                                if (Number.isInteger(newRole)) {
                                    return 'Please use an integer';
                                } else {
                                    return true;
                                }
                            }
                        }
                      ]).then((response) => {
                        updateEmployee(response.newRole, response.employee)
                      })
                    }
                  })
                break;
        }
    })
        .catch(err => {
            console.log('Error on promise ->', err);
        })
}

// initialize the app
init();