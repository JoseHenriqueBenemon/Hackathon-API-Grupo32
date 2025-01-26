const userService = require('../services/user.service');

module.exports = {
  getTeachers: userService.getTeachers,
  getStudents: userService.getStudents,
  getTeacherById: userService.getTeacherById,
  getStudentById: userService.getStudentById,
  createTeacher: userService.createTeacher,
  createStudent: userService.createStudent,
  login: userService.login,
  updateTeacher: userService.updateTeacher,
  updateStudent: userService.updateStudent,
};