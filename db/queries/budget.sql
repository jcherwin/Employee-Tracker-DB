SELECT
department.id as id,
department.name as department,
SUM(role.salary) as budget
FROM employee
LEFT JOIN role
ON employee.role_id = role.id
LEFT JOIN department
ON role.department_id = department.id
WHERE department.id = ?