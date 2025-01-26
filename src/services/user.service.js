const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userSchema, teacherSchema, studentSchema } = require('../validations/user.validation');
const { env } = require('../config/env.config');

module.exports = {
  async getTeachers(_, res) {
    try {
      const teachers = await userRepository.getAllTeachers();
      res.json(teachers);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  async getStudents(_, res) {
    try {
      const students = await userRepository.getAllStudents();
      res.json(students);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  async getTeacherById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await userRepository.getTeacherById(id);
      if (!teacher) return res.status(404).send('Professor não encontrado!');
      res.json(teacher);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await userRepository.getStudentById(id);
      if (!student) return res.status(404).send('Estudante não encontrado!');
      res.json(student);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  async createTeacher(req, res) {
    try {
      const teacherData = teacherSchema.parse(req.body);

      const hashedPassword = await bcrypt.hash(teacherData.password, 10);
      const user = await userRepository.createUser({
        ...teacherData,
        password: hashedPassword,
        user_type: 'Teacher',
      });

      await userRepository.createTeacher({
          teacher_id: user.user_id,
          ...teacherData,
      });

      res.status(201).json(user);
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async createStudent(req, res) {
    try {
        const studentData = studentSchema.parse(req.body);
    
        const hashedPassword = await bcrypt.hash(studentData.password, 10);
        const user = await userRepository.createUser({
          name: studentData.name,
          email: studentData.email,
          password: hashedPassword,
          user_type: 'Student',
        });
    
        // Usa o user_id gerado para criar o registro na tabela student
        await userRepository.createStudent({
          student_id: user.user_id,
        });
    
        res.status(201).json(user);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
  },
  async updateTeacher(req, res) {
    try {
      const { id } = req.params;
  
      const teacher = await userRepository.getTeacherById(id);
      if (!teacher) {
        return res.status(404).send("Professor não encontrado ou o ID não pertence a um professor!");
      }
  
      const teacherData = teacherSchema.partial().parse(req.body);
  
      if (teacherData.password) {
        teacherData.password = await bcrypt.hash(teacherData.password, 10);
      }
  
      const userUpdateData = {
        name: teacherData.name,
        email: teacherData.email,
        password: teacherData.password,
      };
  
      const filteredUserUpdateData = Object.fromEntries(
        Object.entries(userUpdateData).filter(([_, value]) => value !== undefined)
      );
      
      if (Object.keys(filteredUserUpdateData).length > 0) {
        await userRepository.updateUser(id, filteredUserUpdateData);
      }
  
      const teacherUpdateData = {
        personal_id: teacherData.personal_id,
        phone: teacherData.phone,
        is_mentored: teacherData.is_mentored,
        bio: teacherData.bio,
      };
  
      const filteredTeacherUpdateData = Object.fromEntries(
        Object.entries(teacherUpdateData).filter(([_, value]) => value !== undefined)
      );
  
      if (Object.keys(filteredTeacherUpdateData).length > 0) {
        await userRepository.updateTeacher(id, filteredTeacherUpdateData);
      }
  
      res.status(200).send("Professor atualizado com sucesso!");
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async updateStudent(req, res) {
    try {
      const { id } = req.params;

      const student = await userRepository.getStudentById(id);
      if (!student) return res.status(404).send('Estudante não encontrado ou o ID não pertence a um estudante!');

      const studentData = studentSchema.partial().parse(req.body); 

      if (studentData.password) 
        studentData.password = await bcrypt.hash(studentData.password, 10);

      const userUpdateData = {
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
      };
  
      const result = await userRepository.updateUser(id, userUpdateData);

      if (result.affected === 0) return res.status(400).send('Nenhuma informação foi alterada!');
      
      res.status(200).send('Estudante atualizado com sucesso!');
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userRepository.getUserByEmail(email);
      if (!user) return res.status(404).send('Usuário não encontrado!');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).send('Email ou senha inválida, tente novamente!');

      const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
