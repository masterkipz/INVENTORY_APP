const data = {};
data.employees = require("../data/employees.json");

const getEmployees = (req, res) => {
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  res.json({ id: req.params.id });
};

const addEmployee = (req, res) => {
  res.json({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};

const updateEmployee = (req, res) => {
  res.json({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};

const deleteEmployee = (req, res) => {
  res.json({ id: req.body.id });
};

module.exports = {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
