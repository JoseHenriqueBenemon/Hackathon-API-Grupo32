const AppDataSource = require('../config/database');
const UserAccount = require('../models/user/userAccount');
const Student = require('../models/user/student');
const Teacher = require('../models/user/teacher');

const userRepository = AppDataSource.getRepository(UserAccount);
const studentRepository = AppDataSource.getRepository(Student);
const teacherRepository = AppDataSource.getRepository(Teacher);

const teacherSelectColumns = [
  'teacher.teacher_id AS teacher_teacher_id',
  'teacher.personal_id AS teacher_personal_id',
  'teacher.phone AS teacher_phone',
  'teacher.is_mentored AS teacher_is_mentored',
  'teacher.bio AS teacher_bio',
  'user_account.user_id AS user_account_user_id',
  'user_account.user_type AS user_account_user_type',
  'user_account.name AS user_account_name',
  'user_account.email AS user_account_email',
  'user_account.password AS user_account_password',
  'mentoring.mentoring_id AS mentoring_mentoring_id',
  'mentoring.mentoring_date AS mentoring_mentoring_date',
  'mentoring.modality AS mentoring_modality',
  'mentoring.matter AS mentoring_matter',
  'COUNT(likes.mentoring_id) AS mentoring_like_count',
  `EXISTS (
        SELECT 1 FROM likes 
        WHERE likes.mentoring_id = mentoring.mentoring_id 
        AND likes.student_id = :user_id
    ) AS user_has_liked`,
  'jobs.job_id AS jobs_job_id',
  'jobs.title AS jobs_job_title',
  'jobs.company AS jobs_company',
  'jobs.job_type AS jobs_job_type',
  'jobs.modality AS jobs_modality',
  'jobs.publication_date AS jobs_publication_date',
  'jobs.link AS jobs_link',
  'jobs.quantity AS jobs_quantity',
  'jobs.url_image AS jobs_url_image',
];

function buildTeacherQuery(user_id) {
  return teacherRepository
    .createQueryBuilder('teacher')
    .select(teacherSelectColumns)
    .leftJoin('teacher.user_account', 'user_account')
    .leftJoin('teacher.jobs', 'jobs')
    .leftJoin('teacher.mentoring', 'mentoring')
    .leftJoin('likes', 'likes', 'likes.mentoring_id = mentoring.mentoring_id')
    .setParameter("user_id", user_id || null);
}

function formatTeacherData(rawResults) {
  if (!rawResults || rawResults.length === 0) return null;

  const teacherMap = new Map();

  rawResults.forEach(row => {
    const teacherId = row.teacher_teacher_id;

    if (!teacherMap.has(teacherId)) {
      teacherMap.set(teacherId, {
        teacher_id: teacherId,
        personal_id: row.teacher_personal_id,
        phone: row.teacher_phone,
        is_mentored: row.teacher_is_mentored,
        bio: row.teacher_bio,
        user_account: {
          user_id: row.user_account_user_id,
          user_type: row.user_account_user_type,
          name: row.user_account_name,
          email: row.user_account_email,
          password: row.user_account_password
        },
        mentoring: [],
        jobs: []
      });
    }

    if (row.mentoring_mentoring_id) {
      teacherMap.get(teacherId).mentoring.push({
        mentoring_id: row.mentoring_mentoring_id,
        mentoring_date: row.mentoring_mentoring_date,
        modality: row.mentoring_modality,
        matter: row.mentoring_matter,
        like_count: parseInt(row.mentoring_like_count, 10) || 0,
        has_liked: row.user_has_liked,
      });
    }

    if(row.jobs_job_id){
      teacherMap.get(teacherId).jobs.push({
        job_id: row.jobs_job_id,
        title: row.jobs_job_title,
        company: row.jobs_company,
        job_type: row.jobs_job_type,
        modality: row.jobs_modality,
        publication_date: row.jobs_publication_date,
        link: row.jobs_link,
        quantity: row.jobs_quantity,
        url_image: row.jobs_url_image
      })
    }
  });

  return [...teacherMap.values()];
}

module.exports = {
  async getAllTeachers(user_id) {
    const rawResults = await buildTeacherQuery(user_id)
      .groupBy('teacher.teacher_id, user_account.user_id, mentoring.mentoring_id, jobs.job_id')
      .getRawMany();

    return formatTeacherData(rawResults);
  },
  async getTeacherById(id, user_id) {
    const rawResults = await buildTeacherQuery(user_id)
      .where('teacher.teacher_id = :id', { id })
      .groupBy('teacher.teacher_id, user_account.user_id, mentoring.mentoring_id, jobs.job_id')
      .getRawMany();

    return formatTeacherData(rawResults);
  },

  async getAllStudents() {
    return studentRepository.find({ relations: ['user_account'] });
  },
  async getStudentById(id) {
    return studentRepository.findOne({
      where: { student_id: id },
      relations: ['user_account']
    });
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
    return teacherRepository.update({ teacher_id: id }, teacherData);
  },
  async updateStudent(id, studentData) {
    return studentRepository.update({ student_id: id }, studentData);
  },
};