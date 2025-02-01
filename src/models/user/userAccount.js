const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'UserAccount',
  tableName: 'user_account',
  columns: {
    user_id: {
      type: 'int',
      primary: true,
      generated: 'increment',
    },
    user_type: {
      type: 'enum',
      enum: ['Teacher', 'Student'],
    },
    name: {
      type: 'varchar',
      length: 100,
    },
    email: {
      type: 'varchar',
      length: 100,
      unique: true,
    },
    password: {
      type: 'varchar',
      length: 255,
    },
  },
});