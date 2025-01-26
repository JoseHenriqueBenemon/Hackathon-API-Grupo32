const { DataSource } = require('typeorm');
const { env } = require('./env.config');
const UserAccount = require('../models/userAccount');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [UserAccount, Student, Teacher],
});

module.exports = AppDataSource;
