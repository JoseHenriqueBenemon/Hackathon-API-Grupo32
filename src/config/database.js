const { DataSource } = require('typeorm');
const { env } = require('./env.config');
const UserAccount = require('../models/user/userAccount');
const Student = require('../models/user/student');
const Teacher = require('../models/user/teacher');
const Mentoring = require('../models/mentoring/mentoring');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [UserAccount, Student, Teacher, Mentoring],
});

module.exports = AppDataSource;
