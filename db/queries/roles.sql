SELECT
role.id AS id,
role.title AS title,
department.name AS department,
role.salary AS salary
FROM role
LEFT JOIN department
ON role.department_id = department.id;