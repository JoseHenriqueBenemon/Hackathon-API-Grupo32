const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Student',
  tableName: 'student',
  columns: {
    student_id: {
      type: 'int',
      primary: true,
    },
  },
  relations: {
    user_account: {
      target: 'UserAccount',
      type: 'one-to-one',
      joinColumn: {
        name: 'student_id',
        referencedColumnName: 'user_id',
      },
    },
  },
});
