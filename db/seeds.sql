INSERT INTO departments (name)
VALUES ('Veterinarians'), ('Communication'), ('Volunteer'), ('Security');

INSERT INTO roles (title, salary, department_id)
VALUES ('Veterinarian', 250000, 1), ('Veterinarian Assistant', 60000, 1), ('Veterinarian Technician', 75000, 1),('Receptionist', 40000, 2),('Social Media Manager', 50000, 2),('Weekday Volunteer', 0, 3),('Weekend Volunteer', 0, 3),('Security Guard', 60000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Charles', 'Darwin', 1, 1), ('Jimmy', 'Choo', 2, 1), ('Rav', 'Violi', 3, 1),('Water', 'Melon', 4, 2), ('Dante', 'Inferno', 5, 2),('Adelaide', 'Chonk', 8, 3);