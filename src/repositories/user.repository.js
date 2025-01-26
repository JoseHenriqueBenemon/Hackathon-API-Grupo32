const AppDataSource = require('../config/database');
const UserAccount = require('../models/userAccount');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

const userRepository = AppDataSource.getRepository(UserAccount);
const studentRepository = AppDataSource.getRepository(Student);
const teacherRepository = AppDataSource.getRepository(Teacher);

module.exports = {
    async getAllTeachers() {
      return teacherRepository.find({ relations: ['user_account'] });
    },
    async getAllStudents() {
      return studentRepository.find({ relations: ['user_account'] });
    },
    async getTeacherById(id) {
      return teacherRepository.findOne({ where: { teacher_id: id }, relations: ['user_account'] });
    },
    async getStudentById(id) {
      return studentRepository.findOne({ where: { student_id: id }, relations: ['user_account'] });
    },
    async getUserByEmail(email) { 
      return userRepository.findOne({ where: { email } });
    },
    async createUser(userData) {
      return userRepository.save(userData);
    },
    async createTeacher(teacherData) {
      return teacherRepository.save(teacherData);
    },
    async createStudent(studentData) {
      return studentRepository.save(studentData);
    },
    async updateUser(id, userData) {
      return userRepository.update({ user_id: id }, userData);
    },
    async updateTeacher(id, teacherData) {
      return teacherRepository.update({teacher_id: id}, teacherData);
    },
    async updateStudent(id, studentData) {
      return studentRepository.update(id, studentData);
    },
};