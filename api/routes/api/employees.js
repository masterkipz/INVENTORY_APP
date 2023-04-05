const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/employeesController");

router
  .route("/")
  .get(getEmployees)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), addEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
