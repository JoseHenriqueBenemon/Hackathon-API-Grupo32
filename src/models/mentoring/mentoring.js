const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Mentoring",
    tableName: "mentoring",
    columns: {
        mentoring_id: {
            type: 'int',
            primary: true,
            generated: 'increment' 
        },
        teacher_id: {
            type: 'int',
        },
        mentoring_date: {
            type:  'timestamp',
        },
        modality: {
            type: 'varchar',
            length: '15',
        },
        matter: {
            type: 'varchar',
            length: '50',
        },
    },
    relations: {
        teacher: {
            target: 'Teacher',
            type: 'many-to-one',
            JoinColumn: {
                name: 'teacher_id',
                referencedColumnName: "teacher_id"
            }
        }
    },
});