const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Jobs',
  tableName: 'jobs',
  columns: {
    job_id: {
      type: 'int',
      primary: true,
      generated: 'increment' 
    },
    title: {
      type: 'varchar',
      length: 100,
    },
    company: {
      type: 'varchar',
      length: 100,
    },
    job_type: {
      type: 'varchar',
      length: 50        
    },
    modality: {
      type: 'varchar',
      length: 50
    },
    publication_date: {
      type: "timestamp"
    },
    link: {
      type: "varchar",
      length: 255  
    },
    quantity: {
        type: 'int'
    },
    url_image: {
        type: 'varchar',
        length: '255'
    },
    teacher_id: {
        type: 'int'
    }
  },
  relations: {
    teacher: {
      target: 'Teacher',
      type: 'many-to-one',
      joinColumn: { name: 'teacher_id', referencedColumnName: 'teacher_id' }
    },
  },
});
