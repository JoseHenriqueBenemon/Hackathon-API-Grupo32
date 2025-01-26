const express = require('express');
const router = express.Router();
const { authenticate, authorize, authorizeStudentOrSelf } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/teachers', authenticate, authorize('Teacher'), userController.getTeachers);
router.get('/students', authenticate, authorize('Teacher'), userController.getStudents);
router.get('/teachers/:id', authenticate, authorize('Teacher'), userController.getTeacherById);
router.get('/students/:id', authenticate, authorizeStudentOrSelf, userController.getStudentById);
router.post('/teachers', userController.createTeacher);
router.post('/students', userController.createStudent);
router.post('/login', userController.login);
router.put('/teachers/:id', authenticate, authorize('Teacher'), userController.updateTeacher);
router.put('/students/:id', authenticate, authorizeStudentOrSelf, userController.updateStudent);

module.exports = router;