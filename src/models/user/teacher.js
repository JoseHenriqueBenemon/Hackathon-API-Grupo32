const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Teacher',
  tableName: 'teacher',
  columns: {
    teacher_id: {
      type: 'int',
      primary: true,
    },
    personal_id: {
      type: 'varchar',
      length: 14,
      unique: true,
    },
    phone: {
      type: 'varchar',
      length: 20,
    },
    is_mentored: {
      type: 'boolean',
      default: false,
      nullable: true,
    },
    bio: {
      type: 'text',
      nullable: true
    },
  },
  relations: {
    user_account: {
      target: 'UserAccount',
      type: 'one-to-one',
      joinColumn: {
        name: 'teacher_id',
        referencedColumnName: 'user_id',
      },
    },
    mentoring: {
      target: 'Mentoring',
      type: 'one-to-many',
      inverseSide: 'teacher',
    }
  },
});
